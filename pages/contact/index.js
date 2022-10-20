import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Transition from '../../components/Transition';
import SVG_CHECK from '../../public/SVG_CHECK.svg'

const Contact = () => {
    const [localMsg, setLoaclMsg] = useState("");
    const [sent, setsent] = useState(false)
    const [form, setValues] = useState({ name: "", email: "", text: "" });

    const handleSend = () => {
        const { name, email, text } = form;
        if (!name || !email || !text) {
            return setLoaclMsg("Make sure you got all the fields right!")
          } else {
            return setLoaclMsg("Success"); setsent(true);
          }
    };

    const onChange = (e) => {
        setValues({
            ...form, [e.target.name]: e.target.value
        });
    };


  return (
    <Transition>
        <div className='about-container'>
        <div className="about-wrapper">
            <div className="about-text" >
                <span > 👋 </span>
                <h1> Say Hello, <br /> {`I won't bite`} </h1>
                <h6> Allways open door for any contact </h6>
            </div>
            {!sent ? (
                <form className='contact__form' onSubmit={handleSend}>
                    <div className="errorMsg contact__error">
                        {localMsg ? <div className="errorMsg__wrapper"> <span style={{ display: 'flex', alignItems: "center", gap: "1rem" }}> <i className="ri-error-warning-line"></i> {localMsg} </span> </div> : null}
                    </div>
                    <div className="contact__form-inner-text">
                        <input
                            type="name"
                            name="name"
                            id="name"
                            onChange={onChange}
                            placeholder="Your Name"
                        />
                        <span className="contact__form-inner-text-s-name"> Name </span>
                    </div>
                    <div className="contact__form-inner-text">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            onChange={onChange}
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
                            onChange={onChange}
                            placeholder="Tell us something"
                        />
                        <span> Message </span>
                    </div>
                    <button  type="submit" className="send_button">
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