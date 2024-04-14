import React, { useState, useEffect } from 'react';

import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Persik from './panels/Persik';
import EventsList from "./panels/EventsList/EventsList.tsx";
import Event from "./panels/Event/Event.tsx";
import Subscribers from "./panels/Subscribers/Subscribers.tsx";

const App = () => {
	const [activePanel, setActivePanel] = useState('eventsList');
	const [fetchedUser, setUser] = useState(null);
	const [events, setEvents] = useState(null);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [eventUsers, setEventUsers] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [filterDate, setFilterDate] = useState(null);

	useEffect(() => {
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);

			await fetch("https://localhost:7100/api/data/user/add", {
				method: "POST",
				body: JSON.stringify({
					"userId": user.id
				}),
				headers: {
					'Accept': "application/json",
					'Content-Type': "application/json"
				},
			});

			getEvents();

			setPopout(null);
			// console.log(user)
		}
		fetchData();
	}, []);

	const getEvents = (date) => {
		//var newDate = Date.parse(date);
		//console.log(newDate)
		// var utcDate = new Date(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDay());
		// console.log(utcDate)
		console.log(date)

		if(date !== undefined && date !== null){
			var buffDate = new Date(Date.parse(date))
			var buffUtcDate = Date.UTC(buffDate.getFullYear(), buffDate.getMonth(), buffDate.getDate());
			date = new Date(buffUtcDate)
		}

		// Получение событий
		fetch("https://localhost:7100/api/data/filter", {
			method: "POST",
			body: JSON.stringify({
				eventDate: date
			}),
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
	};

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	const openEvent = eventId => {
		const event = events.find(event => event.id === eventId);
		setSelectedEvent(event)
		setActivePanel('event');
	};

	const openSubscribers = () => {
		setPopout(<ScreenSpinner size='large' />)

		fetch("https://localhost:7100/api/data/event/assignedUsers?"  + new URLSearchParams({
			eventId: selectedEvent.id,
		}), {
			method: "GET",
			headers: {
				'Accept': "application/json",
				'Content-Type': "application/json"
			},
		})
			.then(data => {
				data.json().then(eventUsers => {
					console.log(eventUsers)

					var userIds = eventUsers.map(user => user.id).join(',')
					console.log(userIds)

					bridge.send('VKWebAppGetUserInfo', {
						user_ids: userIds
					})
						.then((data) => {
							if (data.result) {
								// Данные пользователя получены
								setEventUsers(data.result)
							} else if(data.id){
								setEventUsers([data])
							}
							console.log(data)
						})
						.catch((error) => {
							// Ошибка
							console.log(error);
						});

				})
			})
			.catch(error => {
				console.log('error', error)
			});

		setPopout(null)
		setActivePanel('subscribers');
	};

	const updateFilterDate = (date) => {
		setFilterDate(date)
		getEvents(date)
	}

	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout popout={popout}>
						<SplitCol>
							<View activePanel={activePanel}>
								<Home id='home' fetchedUser={fetchedUser} go={go} />
								<EventsList id='eventsList' events={events} openEvent={openEvent} filterDate={filterDate} setFilterDate={updateFilterDate} />
								<Event id='event' go={go} event={selectedEvent} openSubscribers={openSubscribers} fetchedUser={fetchedUser} />
								<Subscribers id='subscribers' go={go} event={selectedEvent} users={eventUsers} />
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
