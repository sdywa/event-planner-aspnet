import { FC } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PageLayout } from "../../../components/layouts/page-layout/PageLayout";
import { List } from "../../../components/UI/list/List";
import { ListItem } from "../../../components/UI/list/ListItem";
import { Table } from "../../../components/UI/table/Table";
import { Status } from "../../../components/UI/Status";
import { IStatus } from "../../../types/Api";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

interface IStatisticsProps {};

export const Statistics: FC<IStatisticsProps> = (props) => {
    const navigate = useNavigate();
    const {eventId} = useParams();

    const values = [
        ["Входной билет", 0, 0, [[], 100]],
        ["Очень длинное название которое не помещается", 0, 3, [[0, 0, 0], 0]],
        ["Входной билет", 2, 7, [[100, 100, 100, 100, 100, 100, 100], 1000]],
    ];

    const titles = {
        [IStatus.active]: "активно",
        [IStatus.waiting]: "",
        [IStatus.closed]: "распродано"
    };

    const getData = () => {
        const data = [];
        for (let i = 0; i < values.length; i++) {
            const generate = (name: string, x: number, y: number) => {
                return {
                    name: name,
                    pv: x,
                    [`uv${i}`]:  y,
                }
            }
            for (let j = 0; j < (values[i][3] as number[][])[0].length; j++) {
                data.push(generate(i.toString(), j, (values[i][3] as number[][])[0][j]));
            }
        }
        console.log(data);
        return data;
    }

    return (
        <PageLayout title="Овладение искусством французской выпечки: практический мастер-класс">
            <div className="flex gap-12">
                <List className="w-48 text-black">
                    <ListItem className="text-green">Статистика</ListItem>
                    <ListItem link={`/events/${eventId}/questions`} className="text-darkgray hover:text-gray">Участники</ListItem>
                    <ListItem link={`/events/${eventId}/edit`} className="text-darkgray hover:text-gray" >Обратная связь</ListItem>
                </List>
                <div className="flex flex-col gap-8 w-full">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl">Статистика продаж</h3>
                        <div className="flex">
                            <div className="flex flex-col items-center w-full border-r-2 border-r-lightgray">
                                <span className="text-lg">Заказов</span>
                                <div className="text-2xl font-medium">1000</div>
                            </div>
                            <div className="flex flex-col items-center w-full">
                                <span className="text-lg">Доход</span>
                                <div className="text-2xl font-medium">
                                    99999
                                    <span> руб.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex gap-2 items-center">
                            <h3 className="text-xl">Продажи по билетам</h3>
                            <Link to={`/events/${eventId}/tickets`} className="hover:text-green transition-colors ease-in duration-150">
                                <i className="fa-solid fa-pen text-lg"></i>
                            </Link>
                        </div>
                        <Table headers={["Название", "Статус", "Продажи", "Доход"]} data={values}
                            ceilsSchema={[
                                (value: any) => <div className="font-bold w-full overflow-hidden text-ellipsis whitespace-nowrap">{value}</div>,
                                (value: any) => <span className="px-4">
                                    <Status status={value} titles={titles} />
                                </span>,
                                (value: any) => <div className="px-4">
                                    <span className="font-bold">{value}</span>
                                    <span className="text-sm"> продано</span>
                                </div>,
                                (value: any) => <div className="px-4">
                                    <div>
                                        <span className="font-bold">{value[0].reduce((a: number, b: number) => a + b, 0)}</span>
                                        <span className="text-sm"> руб.</span>
                                    </div>
                                    <div className="text-sm">
                                        { value[1] ? <>{ value[1] } <span> руб.</span> </> : "Бесплатно" }
                                        <span className="text-gray"> / билет</span>
                                    </div>
                                </div>,
                            ]}
                        ></Table>
                        <div className="flex justify-center mt-4">
                            <LineChart width={600} height={300} data={getData()}>
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                {
                                    values.map((v, i) => <Line key={i} type="monotone" dataKey={`uv${i}`} stroke="#8884d8" />)
                                }
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                            </LineChart>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
