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
import dateFunctions from "../../utils/dateUtils";

function Subscribers ({ id, go, event, users }) {

    return <Panel id={id}>
        <PanelHeader
            before={<PanelHeaderBack onClick={go} data-to="event"/>}>Посетители</PanelHeader>
        <Group>
            {users ? users.map(user => {
                return <SimpleCell
                    key={user}
                    before={user.photo_200 ? <Avatar src={user.photo_200}/> : null}
                    subtitle={user.city && user.city.title ? user.city.title : ''}
                    onClick={() => {window.open(`https://vk.com/id${user.id}`)}}
                >
                    {`${user.first_name} ${user.last_name}`}
                </SimpleCell>
            }) : <Div>Посетителей пока нет...</Div>
            }
        </Group>
    </Panel>
}

export default Subscribers;