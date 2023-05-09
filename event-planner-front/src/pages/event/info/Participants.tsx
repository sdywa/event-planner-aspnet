import { FC, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PageLayout } from "../../../components/layouts/page-layout/PageLayout";
import { List } from "../../../components/UI/list/List";
import { ListItem } from "../../../components/UI/list/ListItem";
import { Table } from "../../../components/UI/table/Table";
import EventService from "../../../api/services/EventService";
import { IEventParticipant, IEventParticipantsResponse } from "../../../types/Api";
import { EmptyPlaceholder } from "../../../components/UI/empty-placeholder/EmptyPlaceholder";
import { Modal } from "../../../components/UI/modal/Modal";

export const Participants: FC = () => {
    const navigate = useNavigate();
    const {eventId} = useParams();
    const [eventTitle, setTitle] = useState("");
    const [participants, setParticipants] = useState<IEventParticipantsResponse>();
    const [modalActive, setActive] = useState(false);
    const [participant, setParticipant] = useState<IEventParticipant>();

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (eventId) {
            // Sending request to server
            const getEvent = async () => {
                if (!eventId)
                    return;

                try {
                    const response = await EventService.getParticipants(Number(eventId));
                    setTitle(response.data.title);
                    setParticipants(response.data);
                } catch {
                    navigate("/");
                }
            }
            getEvent();
        }
    }, []);

    return (
        <PageLayout title={eventTitle}>
            <Modal active={modalActive} setActive={setActive}>
                <div className="flex justify-between items-center gap-4">
                    <h3 className="heading--tertiary text-xl">Информация об участнике</h3>
                    <Link to="#" className="text-gray hover:text-darkgray transition-colors duration-150 ease-in align-middle" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); setActive(false)}}><i className="fa-solid fa-xmark text-2xl"></i></Link>
                </div>
                <div className="flex flex-col gap-2 px-4 mt-2">
                    {
                        participant?.answers.map((a, index) =>
                            <div key={index} className="flex flex-col">
                                <div className="text-slate-400 text-sm">{a.question}</div>
                                <div>{a.text}</div>
                            </div>)
                    }
                </div>
            </Modal>
            <div className="flex gap-12">
                <List className="w-48 text-black">
                    <ListItem link={`/events/${eventId}/statistics`} className="text-darkgray hover:text-gray">Статистика</ListItem>
                    <ListItem className="text-green">Участники</ListItem>
                    <ListItem link={`/events/${eventId}/edit`} className="text-darkgray hover:text-gray" >Обратная связь</ListItem>
                </List>
                <div className="flex flex-col gap-8 w-full">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl">Список участников</h3>
                        {
                            participants && participants.participants.length > 0 ?
                                <Table headers={["Имя", "Email"]} data={participants.participants}
                                ceilsSchema={[
                                        (value: IEventParticipant) => <div className="font-medium w-full overflow-hidden text-ellipsis whitespace-nowrap">{value.name} {value.surname}</div>,
                                        (value: IEventParticipant) => <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{value.email}</div>,
                                        (value: IEventParticipant) => <div className="w-6">
                                            <i className="fa-solid fa-xmark text-red text-2xl cursor-pointer" onClick={async (e) => {
                                                e.stopPropagation();
                                                await EventService.deleteParticipant(Number(eventId), value.id);
                                                setParticipants((await EventService.getParticipants(Number(eventId))).data);
                                            }}></i>
                                        </div>
                                    ]}
                                rowCallback={(value: IEventParticipant) => {
                                    setActive(true);
                                    setParticipant(value);
                                }}
                                />
                                :
                                <EmptyPlaceholder text="Пока никто не приобрёл билеты" />
                        }
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
