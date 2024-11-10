
const BACKEND_AI = 'http://127.0.0.1:8000/';

export const comparePhoto = async(photoUrl: string) => {
    const response = await fetch(`${BACKEND_AI}compare`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: photoUrl }),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('photoapi data:', data);
    return data;
};

// input: json object
// {
//   url: string
// }


// output example:
// {
//     "result": [
//         {
//             "community": "Leaves",
//             "similarity_score": 0.9203014373779297
//         },
//         {
//             "community": "Kirby",
//             "similarity_score": 0.7552759697039922
//         },
//         {
//             "community": "Yoshi",
//             "similarity_score": 0
//         }
//     ]
// }
