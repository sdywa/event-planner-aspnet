import { FC } from "react";

const Learn: FC = () => {
    return (
        <section className="flex justify-center items-center h-[calc(100vh-60px)] min-h-[40rem]">
            <div className="flex justify-center items-center gap-16">
                <img src={require("../../assets/img/intro.png")} alt="Интро" />
                <div>
                    <h1 className="heading--primary w-[32rem]">Простота организации мероприятий</h1>
                    <p className="text-lg w-[32rem] font-light">
                        Представляем решение для всех ваших потребностей в планировании мероприятий — EventPlanner! Попрощайтесь со стрессом от организации вашего следующего события независимо от того, что вы организуете.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Learn;
