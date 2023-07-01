//let stopped=false;


const handleRecord  = function ({stream, mimeType}){
    // to collect stream chunks,

    let recordedChunks= [];

    let stopped= false;

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function(e){
        if(e.data.size > 0){
            recordedChunks.push(e.data);
        }
        //shouldStop =>  forceStop by user
        if (shouldStop === true && stopped === false){
            mediaRecorder.stop();
            stopped=true;
        }
    };

    

    mediaRecorder.onstop= function(){
        const blob = new Blob(recordedChunks, {
            type: mimeType
        });

        recordedChunks=[];

        
        downloadLink.href = URL.createObjectURL(blob); // create download link for the file
        downloadLink.download = `${audioFile}.webm`; 
        mediaRecorder.start(2000);
        
    }

    return mediaRecorder;
}

async function recordAudio(){
    const mimeType = 'audio/webm';
    //let shouldStop= false;
    const constraints={
        audio:true,
    }
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    let meadiaRecorderObject= handleRecord({stream,mimeType});
    return meadiaRecorderObject;
}

async function recordVideo(){
    const mimeType = 'video/webm';
    shouldStop=false;
    const constraints={
        audio: true,
        video:true,
    }
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleRecord({stream, mimeType});

}

export {recordAudio};