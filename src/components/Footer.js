import "../css/Footer.css";
import React from "react";

function Footer() {
    return (
        <footer className="Footer">
            <p>Казань, 2023</p>
            <div className="social-links">
                <a href="https://vk.com/felicita_yzk"
                   className="social-link"
                   target="_blank"
                   rel="noreferrer">
                    <img src="/ui/social/vk.png" alt="VK"/>
                </a>
                <a href="https://instagram.com/felicita_yzk?igshid=OGQ5ZDc2ODk2ZA=="
                   className="social-link"
                   target="_blank"
                   rel="noreferrer">
                    <img src="/ui/social/inst.png" alt="Instagram"/>
                </a>
                <a href="https://yandex.ru/maps/-/CCUsz0bW1A"
                   className="social-link"
                   target="_blank"
                   rel="noreferrer">
                    <img src="/ui/social/maps.png" alt="Instagram"/>
                </a>
            </div>
        </footer>
    );
}

export default Footer;