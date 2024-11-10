
const BACKEND_AI = import.meta.env.VITE_BACKEND_AI_URL;

type ResultType = {
    community: string;
    similarity_score: number;
};
type CompareResponseData = {
    result: ResultType[],
}

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
    const data: CompareResponseData = await response.json();
    console.log('photoapi data:', data);
    return data;
};

