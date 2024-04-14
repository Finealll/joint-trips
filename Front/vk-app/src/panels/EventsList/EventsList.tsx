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
    SplitLayout,
    SplitCol, DateInput
} from '@vkontakte/vkui';
import dateFunctions from "../../utils/dateUtils.ts";

function EventsList ({ id, openEvent, events, filterDate, setFilterDate }) {
    return <Panel id={id}>
        <PanelHeader>Культура40</PanelHeader>
        <Div>
            <SplitLayout>
                <SplitCol>
                    <Div>
                        <Button stretched size="l" mode="primary" onClick={() => setFilterDate(null)}>
                            Актуальные
                        </Button>
                    </Div>
                </SplitCol>
                <SplitCol>
                    <Div>
                        <DateInput
                            value={filterDate}
                            onChange={setFilterDate}
                            enableTime={false}
                            disablePast={true}
                            disableFuture={false}
                            closeOnChange={true}
                            disablePickers={false}
                            showNeighboringMonth={true}
                            disableCalendar={false}
                        />
                    </Div>
                </SplitCol>
            </SplitLayout>
        </Div>
        <Group>
            {events ? events.map(event => {
                return <SimpleCell
                    key={event.id}
                    onClick={() => openEvent(event.id)}
                    // @ts-ignore
                    before={event.imageLink ? <Avatar src={event.imageLink}/> : null}
                    subtitle={`${event.date ? (dateFunctions.getFormattedSimpleDate(new Date(event.date))) + ' ' : ''}${event.typeName ? event.typeName + '. ' : ''}${event.placeName ? event.placeName + ' ' : ''}${event.contentRating ? event.contentRating + ' ' : ''}`}
                >
                    {event.title}
                </SimpleCell>
            }) : <Div>Событий нет</Div>
            }
        </Group>
    </Panel>
}

EventsList.propTypes = {
    id: PropTypes.string.isRequired,
    openEvent: PropTypes.func.isRequired,
    events: PropTypes.arrayOf(
        PropTypes.shape({
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
        })
    ),
};

export default EventsList;
