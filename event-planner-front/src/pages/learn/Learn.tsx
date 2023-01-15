import { FC } from "react";
import "./Learn.css";

const Learn: FC = () => {
    return (
        <section className="section-intro">
            <div className="intro-inner">
                <div className="intro-image-box">
                    <img src={require("../../assets/img/intro.png")} alt="Интро" />
                </div>
                <div className="intro-text-box">
                    <h1 className="heading heading--primary">Простота организации мероприятий</h1>
                    <p className="intro-description">
                        Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Learn;