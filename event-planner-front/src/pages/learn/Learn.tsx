import { FC } from "react";

const Learn: FC = () => {
    return (
        <section className="flex justify-center items-center h-[calc(100vh-60px)] min-h-[40rem]">
            <div className="flex justify-center items-center gap-16 max-w-7xl">
                <img src={require("../../assets/img/intro.png")} alt="Интро" />
                <div>
                    <h1 className="heading--primary">Простота организации мероприятий</h1>
                    <p className="text-xl w-96">
                        Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Learn;
