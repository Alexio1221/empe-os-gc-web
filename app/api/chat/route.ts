import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, image } = body;

    if (!prompt || prompt.trim() === "") {
      return Response.json(
        { error: "El prompt no puede estar vacío" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    // 🔥 ORDEN DE MODELOS (de mejor → más barato / más límite)
    const models = [
      "gemini-3-flash-preview",   
      "gemini-3.1-flash-lite-preview",  
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
    ];

    let lastError: any = null;

    for (const modelName of models) {
      try {
        console.log("Intentando modelo:", modelName);

        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: process.env.SYSTEM_INSTRUCTION,
        });

        let result;

        if (image) {
          const { data, mimeType } = image;

          result = await model.generateContent([
            { inlineData: { data, mimeType } },
            prompt,
          ]);
        } else {
          result = await model.generateContent(prompt);
        }

        const response = await result.response;

        console.log("✅ Funcionó con:", modelName);

        return Response.json({
          text: response.text(),
          modelUsed: modelName, // 👈 útil para debug
        });

      } catch (err: any) {
        console.warn("❌ Falló modelo:", modelName);
        console.warn(err?.message);

        lastError = err;

        // 👉 si es error de cuota (429), intenta el siguiente
        if (err?.message?.includes("429")) {
          continue;
        }

        // 👉 otros errores también puedes decidir si continuar
        continue;
      }
    }

    // ❌ Si TODOS fallan
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