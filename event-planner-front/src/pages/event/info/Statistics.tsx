import { FC, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PageLayout } from "../../../components/layouts/page-layout/PageLayout";
import { List } from "../../../components/UI/list/List";
import { ListItem } from "../../../components/UI/list/ListItem";
import { Table } from "../../../components/UI/table/Table";
import { StatusIcon } from "../../../components/UI/Status";
import { Status } from "../../../types/Api";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import EventService from "../../../api/services/EventService";
import { IEventStatistics, IEventTicketsStatistics } from "../../../types/Api";

const colors = [
    "#F94144",
    "#F8961E",
    "#F9C74F",
    "#90BE6D",
    "#4D908E",
    "#277DA1",
    "#F3722C",
    "#F9844A",
    "#43AA8B",
    "#577590"
];

export const Statistics: FC = () => {
    const navigate = useNavigate();
    const {eventId} = useParams();
    const [eventTitle, setTitle] = useState("");
    const [statistics, setStatistics] = useState<IEventStatistics>();

    const titles = {
        [Status.active]: "активно",
        [Status.waiting]: "",
        [Status.closed]: "распродано"
    };

    const getData = () => {
        if (!statistics)
            return;

        const data = [] as {[key: string]: any}[];
        const min = new Date(Math.min.apply(null, statistics.tickets.reduce((a, b) =>
            [...a, ...Object.entries(b.sales).map(s => Number(new Date(s[0])))], [] as number[])));
        min.setDate(min.getDate() - 1);

        while (min <= new Date()) {
            const name = min.toISOString().slice(0, 10);
            data.push({
                name: name
            });
            min.setDate(min.getDate() + 1);
        }

        for (const ticket of statistics.tickets) {
            for (const item of data) {
                item[`ticket${ticket.id}`] = item.name in ticket.sales ? ticket.sales[item.name] : 0;
            }
        }
        console.log(data);
        return data;
    }

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (eventId) {
            // Sending request to server
            const getEvent = async () => {
                if (!eventId)
                    return;

                try {
                    const response = await EventService.getStatistics(Number(eventId));
                    setTitle(response.data.title);
                    setStatistics(response.data);
                } catch {
                    navigate("/");
                }
            }
            getEvent();
        }
    }, []);

    return (
        <PageLayout title={eventTitle}>
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
                                <div className="text-2xl font-medium">{statistics?.count}</div>
                            </div>
                            <div className="flex flex-col items-center w-full">
                                <span className="text-lg">Доход</span>
                                <div className="text-2xl font-medium">
                                    {statistics?.income}
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
                        {
                            statistics && <Table headers={["Название", "Статус", "Продажи", "Доход"]} data={statistics.tickets}
                            ceilsSchema={[
                                    (value: IEventTicketsStatistics) => <div className="font-bold w-full overflow-hidden text-ellipsis whitespace-nowrap">{value.title}</div>,
                                    (value: IEventTicketsStatistics) => <span className="px-4">
                                        <StatusIcon status={(Status[value.status] as unknown) as number} titles={titles} />
                                    </span>,
                                    (value: IEventTicketsStatistics) => <div className="px-4">
                                        <span className="font-bold">{value.salesCount}</span>
                                        <span className="text-sm"> продано</span>
                                    </div>,
                                    (value: IEventTicketsStatistics) => <div className="px-4">
                                        <div>
                                            <span className="font-bold">{value.income}</span>
                                            <span className="text-sm"> руб.</span>
                                        </div>
                                        <div className="text-sm">
                                            { value.price ? <>{ value.price } <span> руб.</span> </> : "Бесплатно" }
                                            <span className="text-gray"> / билет</span>
                                        </div>
                                    </div>,
                                ]}
                            ></Table>
                        }
                        <div className="flex justify-center mt-4">
                            <AreaChart width={600} height={300} data={getData()}>
                                <defs>
                                    {
                                        statistics?.tickets.map((v, i) =>
                                            <linearGradient key={i} id={`colorTicket${v.id}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.7}/>
                                                <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0}/>
                                            </linearGradient>
                                        )
                                    }
                                </defs>
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[
                                    (dataMin: number) => (0 - Math.abs(dataMin)),
                                    (dataMax: number) => {
                                        const value = Math.ceil(Math.log10(dataMax) + dataMax + 1);
                                        const str = value + "";
                                        if (str.length > 2) {
                                            const d = Math.pow(10, str.length - 2);
                                            return Math.ceil(value / d) * d;
                                        }
                                        return value;
                                    }
                                ]} />
                                <Tooltip />
                                {
                                    statistics?.tickets.map((v, i) =>
                                        <Area key={i} type="monotone" dataKey={`ticket${v.id}`} fillOpacity={1} stroke={colors[i % colors.length]} name={v.title} fill={`url(#colorTicket${v.id})`} />
                                    )
                                }
                            </AreaChart>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
