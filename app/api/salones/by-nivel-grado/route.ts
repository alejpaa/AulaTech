import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nivelParam = searchParams.get("nivel")?.toLowerCase().trim();
    const gradoParam = searchParams.get("grado")?.toLowerCase().trim();

    if (!nivelParam || !gradoParam) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    
    // Traer todos los salones
    const { data: allSalones, error } = await supabase
      .from("salones")
      .select("id, seccion, nombre, nivel, grado")
      .eq("activo", true)
      .order("seccion", { ascending: true });

    if (error) {
      console.error("Error fetching salones:", error);
      return NextResponse.json({ error: "Error al obtener secciones" }, { status: 500 });
    }

    // Filtrar en código para case-insensitive
    const salones = allSalones
      ?.filter(s => 
        s.nivel?.toLowerCase().trim() === nivelParam && 
        s.grado?.toLowerCase().trim() === gradoParam
      )
      .map(s => ({ id: s.id, seccion: s.seccion, nombre: s.nombre }));

    console.log("Parámetros recibidos:", { nivelParam, gradoParam });
    console.log("Total de salones en BD:", allSalones?.length);
    console.log("Salones encontrados:", salones);

    return NextResponse.json(salones || []);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
