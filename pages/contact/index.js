import React, { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Transition from '../../components/Transition';
import SVG_CHECK from '../../public/SVG_CHECK.svg'
import { useForm } from 'react-hook-form';
import axios from 'axios';

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);
import { useT } from '../../lib/i18n';

const TOPICS = ['film', 'screenx', 'mv', 'other'];

const Contact = () => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setValue } = useForm();
    const { t } = useT();
    const [sent, setSent] = useState(false);
    const [unexpectedError, setUnexpectedError] = useState("")

    // Spam guard: the API rejects submits that arrive too soon after the form rendered
    useEffect(() => {
        setValue('renderedAt', String(Date.now()))
    }, [setValue])

    async function onSubmitForm(values) {
        clearErrors("name", "email", "text")
        setUnexpectedError("")

        // Always use relative URL - works in both dev and production
        let config = {
            method: 'post',
            url: '/api/contact',
            headers: {
                'Content-type': 'application/json',
            },
            data: values,
        };

        try {
            const response = await axios(config);
            if (response.status === 200) {
                setSent(true);
            }
        } catch (err) {
            console.error('Contact form error:', err)
            const errorMessage = err.response?.data?.error || t("contact.unexpected")
            setUnexpectedError(errorMessage);
        }
    }

    const container = React.useRef(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({ immediateRender: false, autoRemoveChildren: true });
            tl.from(".about-text", { duration: 2, y: "100px", ease: "expo.out" });
            tl.from(["#obj2", "#obj3"], { duration: 2, opacity: 0, y: "96px", skewY: 3, ease: "elastic.out(0.8, 0.5)", stagger: 0.3 }, "0.3");
            tl.from(["#name", "#email", "#text", ".send_button"], { duration: 1, opacity: 0, y: "96px", ease: "expo.out", stagger: 0.2 }, "0.7");
        },
        { scope: container }
    );


    return (
        <Transition>
            <div className='about-container' ref={container}>
                <div className="about-wrapper">
                    <div className="about-text">
                        <h1 id='obj2'>{t("contact.title1")}<br />{t("contact.title2")}</h1>
                        <div id='obj3'>
                            <h6>{t("contact.sub")}</h6>
                            <p> Email : <a href="mailto:hello@kimtaekyun.dev">hello@kimtaekyun.dev</a></p>
                        </div>
                    </div>
                    {!sent ? (
                        <form className='contact__form' onSubmit={handleSubmit(onSubmitForm)}>
                            {/* Honeypot: hidden from humans. If a bot fills it, the API silently drops the submission. */}
                            <input
                                {...register('website')}
                                type="text"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
                            />
                            <input type="hidden" {...register('renderedAt')} />
                            <div className="errorMsg contact__error">
                                {errors?.name?.message || errors?.email?.message || errors?.text?.message || unexpectedError ?
                                    <div className="errorMsg__wrapper">
                                        <span style={{ display: 'flex', alignItems: "center", gap: "1rem" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                <path fill="none" d="M0 0h24v24H0z" />
                                                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" fill="rgba(255,255,255,1)" />
                                            </svg>
                                            {unexpectedError || t("contact.fields")}
                                        </span>
                                    </div>
                                    : null}
                            </div>
                            <fieldset className="contact__topic">
                                <legend className="u-mono">{t("contact.topic")}</legend>
                                {TOPICS.map((topic) => (
                                    <label key={topic}>
                                        <input type="radio" value={topic} {...register("topic")} defaultChecked={topic === "film"} />
                                        <span>{t(`contact.topic.${topic}`)}</span>
                                    </label>
                                ))}
                            </fieldset>
                            <div className="contact__form-inner-text">
                                <input
                                    type="name"
                                    name="name"
                                    id="name"
                                    {...register("name", { required: true })}
                                    placeholder={t("contact.namePh")}
                                />
                                <span className="contact__form-inner-text-s-name">{t("contact.name")}</span>
                            </div>
                            <div className="contact__form-inner-text">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    {...register("email", { required: true })}
                                    placeholder={t("contact.emailPh")}
                                />
                                <span className="contact__form-inner-text-s-email">{t("contact.email")}</span>
                            </div>
                            <div className="contact__form-inner-text">
                                <TextareaAutosize
                                    maxRows={15}
                                    type="text"
                                    name="text"
                                    id="text"
                                    {...register("text", { required: true })}
                                    placeholder={t("contact.messagePh")}
                                />
                                <span>{t("contact.message")}</span>
                            </div>
                            <button type="submit" className="send_button">
                                {t("contact.send")}
                            </button>
                        </form>
                    ) : (
                        <div className='contact__form'>
                            <div className='contact__sent_msg'>
                                <div>{t("contact.sent")} <span> <SVG_CHECK /> </span></div>
                                <div>{t("contact.thanks")}</div>
                                <div>{t("contact.reply")}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Transition>
    )
}

export default Contact