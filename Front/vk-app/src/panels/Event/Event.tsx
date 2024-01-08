import React from 'react';
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
    Gradient, Title, CellButton, PanelHeaderBack, Paragraph, Counter, Spacing, MiniInfoCell, Separator
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

function Event ({ id, go, openSubscribers, event }) {
    return <Panel id={id}>
        <PanelHeader
            before={<PanelHeaderBack onClick={go} data-to="eventsList"/>}>Культура40</PanelHeader>

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
            backgroundPosition: "center"
        }}>
            <Title style={{ marginBottom: 8, marginTop: 20 }} level="1" weight="3">
                {event.title}
            </Title>
        </Div>

        <Group mode="plain">
            <Spacing size={12} />

            <MiniInfoCell before={<Icon20ClockOutline />}>{dateFunctions.getFormattedFullDate(new Date(event.date))}</MiniInfoCell>
            <MiniInfoCell before={<Icon20PlaceOutline />}>{`${event.placeName}. ${event.address}`}</MiniInfoCell>
        </Group>

        <Group mode="plain" header={<Header mode="secondary">Описание</Header>}>
            <Gradient to="bottom">
                <Div>
                    {event.description.split("\n").map(paragr => {
                        return <Paragraph>{paragr}<br/></Paragraph>
                    })}
                </Div>
            </Gradient>
        </Group>
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
