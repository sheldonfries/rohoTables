import React from 'react';
import axios from '../requester';

export default function Uploader() {
    const handleFileSelected = (e) => {
        const files = Array.from(e.target.files);
        const file = files.at(0);
        if (file) {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            // const seasonType = document.querySelector('#seasonType').value;
            reader.onload = function (evt) {
            axios
                .post(
                `/api/uploader/playerStats`, //?isPlayoff=${seasonType === 'playoffs' ? '1' : '0'}`,
                { csvString: evt.target.result }
                )
                .then((res) => {
                const message = document.querySelector('#message');
                message.innerText = 'Success';
                setTimeout(() => {
                    message.innerText = '';
                }, 5000);
                })
                .catch((error) => {
                const message = document.querySelector('#message');
                message.innerText = 'something went wrong';
                setTimeout(() => {
                    message.innerText = '';
                }, 5000);
                });
            };
        }
    }

    return (
        <html lang="en">
            <body style={{paddingLeft : '20px'}} >
                <p>Upload a file:</p>
                <input onChange={handleFileSelected} type="file" />
                <p id="message"></p>
            </body>
        </html>
    );
}