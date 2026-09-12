export const rubricasData = {
    seminarios: {
        titulo: "Evaluación de Seminarios",
        requiereNombre: true,
        items: [
            {
                id: "dominio_tema",
                titulo: "Dominio del tema",
                peso: "35%",
                opciones: [
                    { valor: 5, texto: "EXCELENTE (5): Demuestra un excelente conocimiento del tema, con explicaciones claras, precisas y uso adecuado de la terminología médica. Responde correctamente a las preguntas y comentarios." },
                    { valor: 4, texto: "SOBRESALIENTE (4): Muestra buen conocimiento del tema, aunque algunas áreas requieren mayor claridad o profundización. Responde adecuadamente a la mayoría de las preguntas." },
                    { valor: 3, texto: "APROBADO (3): Tiene un conocimiento aceptable, pero hay varias áreas de confusión o incompletas. Responde de manera limitada a las preguntas y comentarios." },
                    { valor: 2, texto: "POR MEJORAR (2): Conocimiento insuficiente del tema, con explicaciones confusas y muchas áreas sin abordar. Tiene dificultades para responder preguntas." },
                    { valor: 1, texto: "INSUFICIENTE (1): No demuestra suficiente conocimiento del tema y no es capaz de responder las preguntas." }
                ]
            },
            {
                id: "correlacion_clinica",
                titulo: "Correlación básico-clínica",
                peso: "30%",
                opciones: [
                    { valor: 5, texto: "EXCELENTE (5): Integra de manera excelente los conceptos básicos con los aspectos clínicos, utilizando ejemplos claros y bien contextualizados." },
                    { valor: 4, texto: "SOBRESALIENTE (4): Buena correlación entre conceptos básicos y clínicos, aunque algunos ejemplos faltan o están mal explicados." },
                    { valor: 3, texto: "APROBADO (3): Correlación básica aceptable, pero con ejemplos limitados o poco precisos en cuanto a su aplicación clínica." },
                    { valor: 2, texto: "POR MEJORAR (2): La correlación es insuficiente, con pocos ejemplos y una integración débil entre lo básico y lo clínico." },
                    { valor: 1, texto: "INSUFICIENTE (1): No logra correlacionar los conceptos básicos con la práctica clínica, o lo hace de manera errónea." }
                ]
            },
            {
                id: "argumentacion",
                titulo: "Capacidad de argumentación",
                peso: "20%",
                opciones: [
                    { valor: 5, texto: "EXCELENTE (5): Presenta una argumentación sólida, coherente y basada en evidencia científica. Desarrolla las ideas con lógica clara y puede defenderlas frente a preguntas o comentarios." },
                    { valor: 4, texto: "SOBRESALIENTE (4): Argumentación adecuada, aunque algunas ideas no están bien fundamentadas o carecen de profundidad en la evidencia presentada." },
                    { valor: 3, texto: "APROBADO (3): Argumentación básica pero con ideas mal desarrolladas, falta de evidencia o incoherencias en el razonamiento." },
                    { valor: 2, texto: "POR MEJORAR (2): Argumentación débil, con poca capacidad para sustentar las ideas o responder adecuadamente a las objeciones." },
                    { valor: 1, texto: "INSUFICIENTE (1): No presenta una argumentación coherente o clara, con ideas mal organizadas o sin base científica." }
                ]
            },
            {
                id: "claridad_organizacion",
                titulo: "Claridad y organización de la revisión",
                peso: "15%",
                opciones: [
                    { valor: 5, texto: "EXCELENTE (5): La exposición de ideas es clara y está bien estructurada, siguiendo un orden lógico que facilita la comprensión del tema." },
                    { valor: 4, texto: "SOBRESALIENTE (4): La exposición es adecuada pero con algunos momentos de desorganización o falta de claridad." },
                    { valor: 3, texto: "APROBADO (3): La exposición es comprensible pero falta estructura o hay varios momentos confusos." },
                    { valor: 2, texto: "POR MEJORAR (2): La exposición es desorganizada y confusa, lo que dificulta la comprensión del tema." },
                    { valor: 1, texto: "INSUFICIENTE (1): La exposición es caótica y no sigue un orden lógico, lo que impide la comprensión del tema." }
                ]
            }
        ]
    },
    ronda: {
        titulo: "Evaluación de Ronda",
        requiereNombre: false,
        items: [
            {
                id: "anamnesis",
                titulo: "Anamnesis",
                peso: "25%",
                opciones: [
                    { valor: 4, texto: "SOBRESALIENTE (4): Describe los signos o síntomas del paciente de manera precisa, actualizando los diagnósticos enfocados en su enfermedad crítica de manera completa y estructurada. Revisando elementos de los antecedentes y la revisión por sistemas, útiles en el enfoque del paciente" },
                    { valor: 3, texto: "APROBADO (3): Describe los signos o síntomas del paciente, actualizando los diagnósticos enfocados en su enfermedad crítica, de manera completa y estructurada. Analiza algunos componentes de la revisión por sistemas y antecedentes que pueden ser relevantes" },
                    { valor: 2, texto: "POR MEJORAR (2): Reporta pacialmente los signos o síntomas del paciente, sin actualizar los diagnósticos enfocados en su enfermedad crítica. Sin tener en cuenta los antecedentes o la revisión por sistemas" },
                    { valor: 1, texto: "INSUFICIENTE (1): No reporta ningún síntoma o signo del paciente referente a su enfermedad actual, ni actualiza los diagnósticos enfocados en su enfermedad crítica." }
                ]
            },
            {
                id: "examen_fisico",
                titulo: "Examen físico",
                peso: "20%",
                opciones: [
                    { valor: 4, texto: "SOBRESALIENTE (4): Hace una descripción completa, enfatizando en los hallazgos relevantes para la enfermedad crítica. Teniendo en cuenta componentes como drenajes, datos del monitoreo y cambios respecto a hallazgos previos." },
                    { valor: 3, texto: "APROBADO (3): Hace una descripción completa del examen físico, teniendo en cuenta componentes como drenajes o datos del monitoreo" },
                    { valor: 2, texto: "POR MEJORAR (2): Hace una descripción incompleta, sin enfatizar en los hallazgos relevantes para la enfermedad crítica. No tiene en cuenta componentes como drenajes o datos del monitoreo" },
                    { valor: 1, texto: "INSUFICIENTE (1): Hace una descripción insuficiente, incompleta y no relacionada con la enfermedad crítica" }
                ]
            },
            {
                id: "analisis_diagnostico",
                titulo: "Análisis y Diagnóstico",
                peso: "25%",
                opciones: [
                    { valor: 4, texto: "SOBRESALIENTE (4): Expone de manera argumentativa el estado del paciente, planteando un diagnóstico sindromático y mencionando de manera explicativa diagnósticos diferenciales relevantes." },
                    { valor: 3, texto: "APROBADO (3): Expone el estado del paciente de manera completa, planteando un diagnóstico sindromático de forma adecuada, sin mencionar otras opciones o posibilidad diagnósticas." },
                    { valor: 2, texto: "POR MEJORAR (2): Describe el estado del paciente de manera incompleta, planteando un diagnóstico sindromático de forma incompleta o no menciona ningún diagnóstico diferencial relevante al caso del paciente" },
                    { valor: 1, texto: "INSUFICIENTE (1): Describe el estado del paciente de manera incompleta, sin plantear un diagnóstico u objetivos del tratamiento consecuentes" }
                ]
            },
            {
                id: "propuesta_tratamiento",
                titulo: "Propuesta de tratamiento",
                peso: "20%",
                opciones: [
                    { valor: 4, texto: "SOBRESALIENTE (4): Plantea los objetivos del tratamiento, además de la realización de paraclínicos, indicación de medicamentos o procedimientos de manera completa y completamente acordes a las necesidades del paciente" },
                    { valor: 3, texto: "APROBADO (3): Plantea los objetivos del tratamiento, además de la realización de paraclínicos, indicación de medicamentos o procedimientos de manera completa aunque no del todo acordes a las necesidades del paciente" },
                    { valor: 2, texto: "POR MEJORAR (2): Plantea parcialmente los objetivos del tratamiento, además de la realización de paraclínicos, indicación de medicamentos o procedimientos de manera incompleta y no del todo acordes a las necesidades del paciente" },
                    { valor: 1, texto: "INSUFICIENTE (1): Plantea de manera insuficiente o incompleta la realización de estudios paraclínicos, indicación de medicamentos o procedimientos, sin tener en cuenta el estado del paciente." }
                ]
            },
            {
                id: "trabajo_equipo",
                titulo: "Trabajo en equipo y comunicación",
                peso: "10%",
                opciones: [
                    { valor: 4, texto: "SOBRESALIENTE (4): Comunica de manera completa y oportuna (acorde a la gravedad) al o la médico a cargo y/o demás profesionales del equipo, los hallazgos o cambios en el tratamiento del paciente." },
                    { valor: 3, texto: "APROBADO (3): Comunica de manera completa al o la médico a cargo y/o demás profesionales del equipo, los hallazgos o cambios en el tratamiento del paciente." },
                    { valor: 2, texto: "POR MEJORAR (2): Comunica de manera parcial o incompleta al o la médico a cargo y/o demás profesionales del equipo, los hallazgos o cambios en el tratamiento del paciente." },
                    { valor: 1, texto: "INSUFICIENTE (1): No comunica o tiene en cuenta al o la médico a cargo o demás profesionales del equipo, a la hora de informar los hallazgos o cambios en el tratamiento del paciente." }
                ]
            }
        ]
    },
    tema_central: {
        titulo: "Evaluación de Tema Central",
        requiereNombre: false,
        items: [
            {
                id: "dominio_tema",
                titulo: "Dominio del tema",
                peso: "25%",
                opciones: [
                    { valor: 5, texto: "Excelente (5): Demuestra un dominio completo del tema, explicaciones claras, sin errores y buen uso de terminología médica. Responde a todas las preguntas." },
                    { valor: 4, texto: "Sobresaliente (4): Conocimiento profundo, explicaciones mayormente claras, una o dos imprecisiones menores. Usa bien la terminología." },
                    { valor: 3, texto: "Bueno (3): Conoce bien el tema, algunas explicaciones confusas o incompletas. Usa bien la terminología, pero con errores menores. Responde a la mayoría de las preguntas." },
                    { valor: 2, texto: "Regular (2): Conocimiento básico, explicaciones confusas, uso incorrecto de terminología. Dificultades para responder preguntas." },
                    { valor: 1, texto: "Malo (1): No demuestra conocimiento adecuado, explicaciones incorrectas o confusas, mal uso de terminología. No responde correctamente a preguntas." }
                ]
            },
            {
                id: "correlacion_clinica",
                titulo: "Correlación basico-clinica",
                peso: "20%",
                opciones: [
                    { valor: 5, texto: "Excelente (5): Integra conceptos básicos y clínicos con gran precisión. Ejemplos clínicos relevantes y bien aplicados." },
                    { valor: 4, texto: "Sobresaliente (4): Integra bien conceptos básicos y clínicos. Ejemplos pertinentes, aunque falta algo de profundidad." },
                    { valor: 3, texto: "Bueno (3): Presenta una correlación básica, pero algunos ejemplos o aplicaciones no son claros o pertinentes." },
                    { valor: 2, texto: "Regular (2): Correlación limitada, ejemplos no adecuados o mal aplicados, dificulta la comprensión." },
                    { valor: 1, texto: "Malo (1): No hay correlación clara entre conceptos básicos y la clínica. No presenta ejemplos clínicos o los aplica incorrectamente." }
                ]
            },
            {
                id: "argumentacion",
                titulo: "Capacidad de argumentación",
                peso: "20%",
                opciones: [
                    { valor: 5, texto: "Excelente (5): Argumentos coherentes, bien estructurados y fundamentados en evidencia científica. Defiende bien sus puntos frente a preguntas críticas." },
                    { valor: 4, texto: "Sobresaliente (4): Argumenta de manera clara y fundamentada, aunque falta profundidad en algunos detalles." },
                    { valor: 3, texto: "Bueno (3): Argumentación coherente, pero con puntos poco desarrollados. Evidencia suficiente, pero no robusta." },
                    { valor: 2, texto: "Regular (2): Argumentación débil, razonamientos poco claros o mal estructurados. Evidencia insuficiente o irrelevante." },
                    { valor: 1, texto: "Malo (1): No desarrolla argumentos coherentes ni claros. Defensa de puntos deficiente y sin base científica." }
                ]
            },
            {
                id: "claridad_organizacion",
                titulo: "Claridad y organización",
                peso: "15%",
                opciones: [
                    { valor: 5, texto: "Excelente (5): Presentación clara, bien estructurada, con orden lógico. Exposición fluida sin interrupciones." },
                    { valor: 4, texto: "Sobresaliente (4): Presentación mayormente clara y bien estructurada, con algunas partes menos organizadas. Exposición fluida en su mayoría." },
                    { valor: 3, texto: "Bueno (3): Presentación comprensible, pero algunas secciones carecen de estructura o son confusas. Fluidez intermitente en la exposición." },
                    { valor: 2, texto: "Regular (2): Presentación desorganizada, lo que dificulta la comprensión. Interrupciones o falta de coherencia en la exposición." },
                    { valor: 1, texto: "Malo (1): Presentación caótica, sin estructura clara. Exposición confusa, sin orden lógico, dificulta la comprensión." }
                ]
            },
            {
                id: "ayudas_didacticas",
                titulo: "Ayudas didacticas",
                peso: "10%",
                opciones: [
                    { valor: 5, texto: "Excelente (5): Recursos visuales de alta calidad, bien integrados, que facilitan la comprensión y aportan profundidad al contenido." },
                    { valor: 4, texto: "Sobresaliente (4): Recursos visuales adecuados y bien utilizados, aunque algunos podrían mejorarse." },
                    { valor: 3, texto: "Bueno (3): Recursos funcionales, pero no siempre bien integrados o relevantes. Aportan algo de claridad, pero podrían ser más efectivos." },
                    { valor: 2, texto: "Regular (2): Recursos visuales insuficientes o mal utilizados, no aportan significativamente a la comprensión del contenido." },
                    { valor: 1, texto: "Malo (1): No se utilizan recursos visuales, o son de muy baja calidad y no contribuyen a la comprensión del tema." }
                ]
            },
            {
                id: "adaptacion_virtual",
                titulo: "Adaptación a entorno virtual",
                peso: "10%",
                opciones: [
                    { valor: 5, texto: "Excelente (5): Maneja la plataforma (Meet) con destreza, calidad de audio y video excelente. Interacción con el público fluida y efectiva." },
                    { valor: 4, texto: "Sobresaliente (4): Maneja bien la plataforma, aunque con pequeños problemas técnicos que no afectan gravemente la presentación. Interacción adecuada." },
                    { valor: 3, texto: "Bueno (3): Maneja la plataforma con problemas menores que afectan la fluidez. Interacción con el público limitada." },
                    { valor: 2, texto: "Regular (2): Problemas técnicos frecuentes que interrumpen la presentación. Interacción insuficiente con el público." },
                    { valor: 1, texto: "Malo (1): No maneja bien la plataforma, con problemas técnicos graves que afectan la presentación. Sin interacción efectiva con el público." }
                ]
            }
        ]
    }
};
