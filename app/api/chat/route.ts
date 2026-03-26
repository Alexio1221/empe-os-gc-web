import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "@/app/config/systemInstruction";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history = [], image } = body;

    if (!message || message.trim() === "") {
      return Response.json(
        { error: "El prompt no puede estar vacío" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const historyText = history
      .map((msg: any) => {
        const role = msg.role === "model" ? "IA" : "Usuario";
        return `${role}: ${msg.parts?.[0]?.text || ""}`;
      })
      .join("\n");

    const models = [
      "gemini-3-flash-preview",
      "gemini-3.1-flash-lite-preview",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
    ];

    let lastError: any = null;

    for (const modelName of models) {
      try {
        //console.log("Intentando modelo:", modelName);

        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_INSTRUCTION,
        });

        let result;
        const fullPrompt = `${historyText} Usuario: ${message} IA:`;
        //console.log(fullPrompt)
        if (image) {
          const { data, mimeType } = image;

          result = await model.generateContent([
            { inlineData: { data, mimeType } },
            fullPrompt,
          ]);
        } else {
          result = await model.generateContent(fullPrompt);
        }

        const response = await result.response;

        //console.log("Funcionó con:", modelName);

        return Response.json({
          text: response.text(),
          modelUsed: modelName,
        });

      } catch (err: any) {
        console.warn("Falló modelo:", modelName);
        console.warn(err?.message);

        lastError = err;

        // si es error de cuota (429), intenta el siguiente
        if (err?.message?.includes("429")) {
          continue;
        }

        // otros errores también puede decidir si continuar
        continue;
      }
    }

    //  Si TODOS fallan
    return Response.json(
      {
        error: "Todos los modelos fallaron",
        detail: lastError?.message,
      },
      { status: 500 }
    );

  } catch (error: any) {
    console.error("ERROR GENERAL:", error);

    return Response.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}