import React, { useState } from 'react'
import info from 'assets/info.png'
export default function Cookies() {
    const [cookies,setCookies] =useState(false)

    return (
    !cookies &&
    <div className='Cookies'>
        <img src={info} alt="info" className='FooterLogo' />
        <div className='CookiesText'>This website uses cookies</div>
        <div onClick={()=>setCookies(true)} className='ActionCookies'>OK</div>
    </div>
    )
}
