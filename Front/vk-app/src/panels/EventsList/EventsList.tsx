import React from 'react';
import PropTypes, {func, string} from 'prop-types';

import {Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, SimpleCell} from '@vkontakte/vkui';
import dateFunctions from "../../utils/dateUtils.ts";

function EventsList ({ id, openEvent, events }) {
    return <Panel id={id}>
        <PanelHeader>Культура40</PanelHeader>
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
