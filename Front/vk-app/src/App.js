import React, { useState, useEffect } from 'react';

import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Persik from './panels/Persik';
import EventsList from "./panels/EventsList/EventsList.tsx";
import Event from "./panels/Event/Event.tsx";

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [events, setEvents] = useState(null);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	useEffect(() => {
		async function fetchData() {
			// const user = await bridge.send('VKWebAppGetUserInfo');
			// setUser(user);

			// https://93.81.237.84:7101/api/data/filter
			fetch("https://localhost:7100/api/data/filter", {
				method: "POST",
				body: JSON.stringify({}),
				headers: {
					'Accept': "application/json",
					'Content-Type': "application/json"
				},
			})
			.then(data => {
				data.json().then(events => {
					console.log(events)
					setEvents(events)
				})
			})
			.catch(error => {
				console.log('error', error)
			});

			setPopout(null);
			// console.log(user)
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	const openEvent = eventId => {
		const event = events.find(event => event.id === eventId);
		setSelectedEvent(event)
		setActivePanel('event');
	};

	const openSubscribers = eventId => {
		const event = events.find(event => event.id === eventId);
		setSelectedEvent(event)
		setActivePanel('event');
	};

	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout popout={popout}>
						<SplitCol>
							<View activePanel={activePanel}>
								<Home id='home' fetchedUser={fetchedUser} go={go} />
								<EventsList id='eventsList' events={events} openEvent={openEvent} />
								<Event id='event' go={go} event={selectedEvent} openSubscribers={openSubscribers} />
								<Persik id='persik' go={go} />
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
