import { FC } from "react";
import "./PageLayout.css";

interface IPageLayoutProps {
    title: string,
    children: React.ReactNode
};

export const PageLayout: FC<IPageLayoutProps> = ({title, children}) => {
    return (
        <section className="page-section">
            <div className="page-inner container">
                <h2 className="heading--secondary">{title}</h2>
                {children}
            </div>
        </section>
    );
}
