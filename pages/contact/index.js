import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Transition from '../../components/Transition';
import SVG_CHECK from '../../public/SVG_CHECK.svg'
import { useForm } from 'react-hook-form';
import axios from 'axios';

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

const Contact = () => {
    const { register, handleSubmit, formState: { errors }, clearErrors } = useForm();
    const [sent, setSent] = useState(false);
    const [unexpectedError, setUnexpectedError] = useState("")
    async function onSubmitForm(values) {
        clearErrors("name", "email", "text")

        let config = {
            method: 'post',
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/contact`,
            headers: {
                'Content-type': 'application/json',
            },
            data: values,
        };

        try {
            const response = await axios(config);
            console.log(response);
            if (response.status === 200) {
                setSent(true);
            }
        } catch (err) {
            console.log(err)
            setUnexpectedError("Unexpected error. Try again later.");
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
                        <h1 id='obj2'> Say Hello, <br /> {`I won't bite`} </h1>
                        <div id='obj3'>
                            <h6> Allways open door for any contact </h6>
                            <p> Email :<a>hello@kimtaekyun.dev </a></p>
                        </div>
                    </div>
                    {!sent ? (
                        <form className='contact__form' onSubmit={handleSubmit(onSubmitForm)}>
                            <div className="errorMsg contact__error">
                                {errors?.name?.message || errors?.email?.message || errors?.text?.message || unexpectedError ?
                                    <div className="errorMsg__wrapper">
                                        <span style={{ display: 'flex', alignItems: "center", gap: "1rem" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                <path fill="none" d="M0 0h24v24H0z" />
                                                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" fill="rgba(255,255,255,1)" />
                                            </svg>
                                            {unexpectedError || "Make sure you got all the fields right!"}
                                        </span>
                                    </div>
                                    : null}
                            </div>
                            <div className="contact__form-inner-text">
                                <input
                                    type="name"
                                    name="name"
                                    id="name"
                                    {...register("name", { required: "triger message this is notting" })}
                                    placeholder="Your Name"
                                />
                                <span className="contact__form-inner-text-s-name"> Name </span>
                            </div>
                            <div className="contact__form-inner-text">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    {...register("email", { required: "triger message this is notting" })}
                                    placeholder="Email Addres"
                                />
                                <span className="contact__form-inner-text-s-email"> Email </span>
                            </div>
                            <div className="contact__form-inner-text">
                                <TextareaAutosize
                                    maxRows={15}
                                    type="text"
                                    name="text"
                                    id="text"
                                    {...register("text", { required: "triger message this is notting" })}
                                    placeholder="Tell us something"
                                />
                                <span> Message </span>
                            </div>
                            <button type="submit" className="send_button">
                                {`Send message >`}
                            </button>
                        </form>
                    ) : (
                        <div className='contact__form'>
                            <div className='contact__sent_msg'>
                                <div> A Massage has been sent. <span> <SVG_CHECK /> </span></div>
                                <div> Thank you for sending message! </div>
                                <div> We will contact you shortly </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Transition>
    )
}

export default Contact