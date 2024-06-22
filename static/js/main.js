document.getElementById('prediction-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('file', document.getElementById('file').files[0]);
    
    const response = await fetch('/predict', {
        method: 'POST',
        body: formData
    });
    
    const result = await response.json();
    console.log(result);  // Log the response to see its content
    if (result.error) {
        document.getElementById('result').innerText = 'Error: ' + result.error;
    } else {
        const prediction = result.prediction;
        document.getElementById('result').innerText = 'Prediction: ' + prediction;
        
        // Update description based on prediction
        const descriptions = {
            'Protoreaster nodosus': 'Protoreaster nodosus, also known as the horned sea star, is a species of sea star found in the warm waters of the Indo-Pacific region. It is known for its distinctive knobby appearance.',
            'Culcita novaguineae': 'Culcita novaguineae, commonly known as the cushion star, is a species of sea star with a rounded, cushion-like appearance. It is found in the Indo-Pacific region.',
            'Linckia laevigata': 'Linckia laevigata, commonly known as the blue star, is a species of sea star found in the shallow waters of the Indo-Pacific region. It is notable for its striking blue color.',
            'Luidia foliolata': 'Luidia foliolata, commonly known as the sand star, is a species of sea star found in the Pacific Ocean. It is known for its long, slender arms and its ability to move quickly across the sand.'
        };

        // Display description based on prediction
        if (descriptions[prediction]) {
            document.getElementById('description').innerText = descriptions[prediction];
        } else {
            document.getElementById('description').innerText = 'Description not available.';
        }
    }
});
