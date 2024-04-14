import React, { useState, useEffect } from 'react';
import PropTypes, {func, string} from 'prop-types';

import {
    Panel,
    PanelHeader,
    Header,
    Button,
    Group,
    Cell,
    Div,
    Avatar,
    SimpleCell,
    FixedLayout,
    Gradient,
    Title,
    CellButton,
    PanelHeaderBack,
    Paragraph,
    Counter,
    Spacing,
    MiniInfoCell,
    Separator,
    ButtonGroup,
    ScreenSpinner, SplitCol, SplitLayout
} from '@vkontakte/vkui';
import {
    Icon28AddOutline,
    Icon28SchoolOutline,
    Icon20Like,
    Icon20CommunityName,
    Icon20MessageOutline, Icon20ArticleOutline, Icon20PlaceOutline, Icon20MentionOutline, Icon20ClockOutline
} from "@vkontakte/icons";
import * as events from "events";
import * as url from "url";
import dateFunctions from "../../utils/dateUtils.ts";
import bridge from "@vkontakte/vk-bridge";

const styles = {
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 32,
};

const badgesBlock = {
    display: 'flex',
    flexDirection: 'right',
    alignItems: 'right',
    justifyContent: 'right',
    textAlign: 'right',
    padding: 32,
};

function Icon20Clock() {
    return null;
}

function Event ({ id, go, fetchedUser, openSubscribers, event }) {
    const [usersCount, setUsersCount] = useState(0);
    const [isUserGoing, setIsUserGoing] = useState(false);
    const [isUserFoundPair, setIsUserFoundPair] = useState(false);
    const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

    const updateMetrics = (userId, eventId) => {
        fetch("https://localhost:7100/api/data/event/metrics?"  + new URLSearchParams({
            eventId: eventId,
            userId: userId,
        }), {
            method: "GET",
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json"
            },
        })
            .then(data => {
                data.json().then(metrics => {
                    console.log(metrics)
                    setUsersCount(metrics.usersCount)
                    setIsUserFoundPair(metrics.isUserFoundPair)
                    setIsUserGoing(metrics.isUserGoing)
                })
            })
            .catch(error => {
                console.log('error', error)
            });
    };

    useEffect(() => {
        async function fetchData(){
            updateMetrics(fetchedUser.id, event.id);
            setPopout(null)
        }
        fetchData()
    },[])

    const onWantGo = e => {
        fetch("https://localhost:7100/api/data/user/assign", {
            method: "POST",
            body: JSON.stringify({
                userId: fetchedUser.id,
                eventId: event.id,
            }),
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json"
            },
        })
            .then(data => {
                updateMetrics(fetchedUser.id, event.id);
            })
            .catch(error => {
                updateMetrics(fetchedUser.id, event.id);
            });
    };

    const onWantNotGo = e => {
        fetch("https://localhost:7100/api/data/user/unassign", {
            method: "POST",
            body: JSON.stringify({
                userId: fetchedUser.id,
                eventId: event.id,
            }),
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json"
            },
        })
            .then(data => {
                updateMetrics(fetchedUser.id, event.id);
            })
            .catch(error => {
                updateMetrics(fetchedUser.id, event.id);
            });
    };

    const onPairFounded = e => {
        fetch("https://localhost:7100/api/data/user/foundPair", {
            method: "POST",
            body: JSON.stringify({
                userId: fetchedUser.id,
                eventId: event.id,
            }),
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json"
            },
        })
            .then(data => {
                updateMetrics(fetchedUser.id, event.id);
            })
            .catch(error => {
                updateMetrics(fetchedUser.id, event.id);
            });
    };

    const onPairUnFounded = e => {
        fetch("https://localhost:7100/api/data/user/unFoundPair", {
            method: "POST",
            body: JSON.stringify({
                userId: fetchedUser.id,
                eventId: event.id,
            }),
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json"
            },
        })
            .then(data => {
                updateMetrics(fetchedUser.id, event.id);
            })
            .catch(error => {
                updateMetrics(fetchedUser.id, event.id);
            });
    };

    return <Panel id={id}>
        <PanelHeader
            before={<PanelHeaderBack onClick={go} data-to="eventsList"/>}>{event.title}</PanelHeader>

        <SplitLayout popout={popout}>
            <SplitCol>
                <Div style={{
                    height: "50vh",
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'bottom',
                    justifyContent: 'flex-end',
                    backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)), url('${event.imageLink}')`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative"
                }}>
                    <Div style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        padding: "2px 10px",
                        margin: "10px",
                        borderRadius: "30%",
                        backgroundColor: "rgba(255,255,255,1)",
                        color: "black"
                    }}>
                        {usersCount}
                    </Div>
                    <Title style={{ marginBottom: 8, marginTop: 20 }} level="1" weight="3">
                        {event.title}
                    </Title>
                </Div>

                <Group mode="plain">
                    <Spacing size={12} />

                    <MiniInfoCell before={<Icon20ClockOutline />}>{dateFunctions.getFormattedFullDate(new Date(event.date))}</MiniInfoCell>
                    <MiniInfoCell before={<Icon20PlaceOutline />}>{`${event.placeName}. ${event.address}`}</MiniInfoCell>
                </Group>


                {event.description ? <Group mode="plain" header={<Header mode="secondary">Описание</Header>}>
                    <Gradient to="bottom">
                        <Div>
                            {event.description.split("\n").map(paragr => {
                                return <Paragraph>{paragr}<br/></Paragraph>
                            })}
                        </Div>
                    </Gradient>
                </Group>
                    : <></>
                }

                {event.url ? <Div>
                    <Button stretched size="l" mode="primary" onClick={() => window.open(`https://afisha.yandex.ru${event.url}`)}>
                        Билеты
                    </Button>
                </Div> : <></>}

                <Div>
                <ButtonGroup stretched>
                    {
                        !isUserGoing ? <Button stretched size="l" mode="primary" onClick={onWantGo}>
                            Хочу пойти
                        </Button> : <Button stretched size="l" mode="primary" onClick={onWantNotGo}>
                            Не пойду
                        </Button>
                    }
                    {
                        isUserGoing && !isUserFoundPair ? <Button stretched size="l" mode="primary" onClick={openSubscribers}>
                            Посетители
                        </Button> :<></>
                    }
                    {
                        isUserGoing && !isUserFoundPair ? <Button stretched size="l" mode="primary" onClick={onPairFounded}>
                            Пара найдена
                        </Button> : <></>
                    }
                    {
                        isUserGoing && isUserFoundPair ? <Button stretched size="l" mode="primary" onClick={onPairUnFounded}>
                            Отказаться от пары
                        </Button> : <></>
                    }
                </ButtonGroup>
                </Div>
            </SplitCol>
        </SplitLayout>
    </Panel>
}

Event.propTypes = {
    id: PropTypes.string.isRequired,
    openSubscribers: PropTypes.func.isRequired,
    event: PropTypes.shape({
        id: PropTypes.int,
        extraId: PropTypes.string,
        url: PropTypes.string,
        title: PropTypes.string,
        placeName: PropTypes.string,
        address: PropTypes.string,
        contentRating: PropTypes.string,
        description: PropTypes.string,
        date: PropTypes.string,
        typeName: PropTypes.string,
        imageLink: PropTypes.string,
        users: PropTypes.array
    }),
};

export default Event;
