// File that handles the communication between the frontend and the openai api by 
// Next.js API route to handle POST requests, interact with OpenAI’s chat completion API, 
//and stream the results back to the client. It uses the OpenAI library to send a chat completion 
//request and processes the streaming response to send back to the client in real-time.
// sending a request to the openai api, generating a response using the specified model, 
// and streaming the generated response back to the client 

// import necessary libraries

import {NextResponse} from 'next/server' // 
import OpenAI from 'openai' // import client library for interacting with the OPENAI API 


// system prompt: predifined instruction given to the model that sets its behavior / personality
// setting the context,tone, personality that the ai should adhere to during the coversation 

const systemPrompt = "hello";

// sytanx for declaring a fucntion in javascript 

// POST fucntion to handle incoming requests to the api 

// paremeneters : req, where req is an http request object 
export async function POST(req)
{


    const openai = new OpenAI() // create an instance of the open ai client 
    apiKey: process.env.OPENAI_API_KEY
    // parses the body of the http request thats in JSON format and returns the resulting javascript object 
    // 'req' : object representing the incoming HTTP request, contains details about the request such as headers,method, url ans body of the request
    // 'await' : pauses the execution of the function until the promise returned by req.json
    // const data: This defines a constant variable named data that will hold the parsed JSON data.
    const data = await req.json() 
                                  // parsing JSON
                                  // Once the JSON is parsed and assigned to data, you can work with it as a regular JavaScript object

  

    // chat completion refers to the process of generating a response or continuation of a conversation 
    // sends a request to the openai api to generate a chat completion 
    // chat completion api accepts inputs via the messages paramter, which is an array of message objects 
    // each message object has a role : The user messages provide requests or comments for the assistant to respond to
    const  chatCompletion = await openai.chat.completions.create({

        messages : [{"role":"system","content":systemPrompt}, ... data],
        model: "gpt-4.o-mini",
        stream: true, // Enable streaming reponses from the api, makes it so that the responses generated are delivered back to the client in real time 
    })


    // up to this point we havent processed the reponse to be able to print it back to the client 

    // now that we have the streaming components, we need to output it to the front end using a stream response 

const stream = new ReadableStream({

    async start (controller){
        const encoder = new TextEncoder()

        try {// iterate over the streamed chunks
           
        // format response to clients needs, since we are streaming the response, we need to format the resposne to a stream 
        for await (const chunk of chatCompletion){

            const stringToEncode = chunk.choices[0]?.delta?.content;

            if(string){
                const encodedString = encoder.encode(content)
                controller.enqueue(encodedString)
            }

        }
    }catch(err){
        controller.error(err)
    }finally{

        controller.close()
    }


    }

})


   
   
   
    return  new NextResponse(stream)// return the processed and formatted response to the client
} // end of Post fucnt definition 

