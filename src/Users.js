import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';

export default function Users() {
	const [data, setData] = useState([]);

	useEffect(() => {
		const url = 'https://jsonplaceholder.typicode.com/users';
    fetch(url).then((response) => {
      response.json()
        .then((res) => {
          setData(res);
          localStorage.setItem('users', JSON.stringify(res))
        })
    }).catch((err) => {
      const collection = localStorage.getItem('users')
      setData(JSON.parse(collection))
    });
	}, []);

	return (
    <div>
      <div>{navigator.onLine ? '' : 'You are in offline mode'}</div>
			<Table
				striped
				bordered
				hover
			>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Email</th>
						<th>Phone</th>
					</tr>
				</thead>
				<tbody>
					{data.map((item) => (
						<tr key={item.id}>
							<td>{item.id}</td>
							<td>{item.name}</td>
							<td>{item.email}</td>
							<td>{item.phone}</td>
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
}
