import { Client } from '@gradio/client';

import { fail, type Actions } from "@sveltejs/kit";

type Confidence = {
    label: string;
    confidence: number;
};

type Prediction = {
    label: string;
    confidences: Confidence[];
};

let gradioClient: Client | null = null;

async function getGradioClient() {
    if (!gradioClient) {
        try {
            console.log("ENKKKKK")

            gradioClient = await Client.connect("Dundale/CVMIL-1");
        } catch (error) {
            throw error;
        }
    }

    return gradioClient;
}

export const actions = {
    predict: async ({ request }) => {
        const formData = await request.formData();

        const chosenPhoto = formData.get("chosenPhoto");
        const chosenModel = formData.get("chosenModel");

        console.log("We have reached +page.server.ts!");
        console.log(chosenPhoto);
        console.log(chosenModel);

        if (!(chosenPhoto instanceof File)) {
            return fail(400, { 
                message: "Invalid or missing photo input." 
            });
        }
        if (typeof chosenModel !== "string" || (chosenModel !== "ViT" && chosenModel !== "CNN")) {
            return fail(400, { 
                message: "Invalid or missing model input."
            });
        }

        console.log("Validation is good!");

        try {
            const client = await getGradioClient();
        
            if (client) {
                console.log("Client initialized!");
            }

            const result = await client.predict("/predict", {
                image: chosenPhoto,
                model_choice: chosenModel,
            });

            if (result) {
                console.log("Result resulted in a result! Wow!")
            }
    
            const rawPrediction = result.data as Prediction[];

            const prediction = rawPrediction[0];
    
            console.log(prediction);

            return {
                success: true, prediction
            };

        } catch (error) {
            return fail(500, {
                message: "Failed to get prediction from model.", details: error.message
            });
        }
    }
} satisfies Actions;