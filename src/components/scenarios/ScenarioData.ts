export interface ScenarioConfig {
  id: string;
  title: string;
  phase: number;
  description: string;
  dialogues: string[];
  question: {
    text: string;
    options: string[];
    correctIndex: number;
    feedbackSuccess: string;
    feedbackError: string;
  };
}

export const SCENARIO_DATA: Record<string, ScenarioConfig> = {
  // --- FASE 1: COMUNIDADE ---
  'rua-acesso': {
    id: 'rua-acesso',
    title: 'Rua de Acesso',
    phase: 1,
    description: 'Você está avaliando o acesso geográfico e saneamento básico na rua principal da comunidade. Observa-se esgoto a céu aberto em alguns trechos e acúmulo de lixo nas calçadas.',
    dialogues: [
      'Agente de Saúde: "Doutor, muitos moradores aqui sofrem com infestações de vetores no verão por causa do lixo."',
      'Líder Comunitário: "A prefeitura passa coletando o lixo apenas uma vez por semana nessa área."'
    ],
    question: {
      text: 'Qual a principal ação de vigilância em saúde que a equipe de atenção básica deve articular neste cenário?',
      options: [
        'Prescrever antibióticos profiláticos para todos os moradores da rua.',
        'Notificar a vigilância ambiental/sanitária municipal e mobilizar a comunidade para ações de educação em saúde e mutirão de limpeza.',
        'Aconselhar os moradores a se mudarem para outra rua mais saneada.',
        'Aguardar o surto de leptospirose para iniciar as ações médicas na UBS.'
      ],
      correctIndex: 1,
      feedbackSuccess: 'Parabéns! Articular ações com a vigilância ambiental e engajar a comunidade em saneamento básico são pilares da Atenção Primária.',
      feedbackError: 'Incorreto. A Atenção Primária atua de forma preventiva e coletiva antes que as doenças se instalem.'
    }
  },
  'centro-comunitario': {
    id: 'centro-comunitario',
    title: 'Centro Comunitário',
    phase: 1,
    description: 'No centro comunitário, está acontecendo um grupo de discussão sobre prevenção de hipertensão e diabetes coordenado pelo Núcleo de Apoio à Saúde da Família (NASF).',
    dialogues: [
      'Nutricionista: "Estamos explicando sobre a redução do consumo de sal usando temperos naturais."',
      'Morador: "Doutor, eu tenho dificuldade de encontrar alimentos frescos baratos aqui perto."'
    ],
    question: {
      text: 'Qual a melhor estratégia para promover a alimentação saudável neste território com poucos recursos?',
      options: [
        'Recomendar suplementos alimentares importados de alto custo.',
        'Propor a criação de uma horta comunitária no espaço do centro comunitário e ensinar receitas com alimentos acessíveis da época.',
        'Pedir que parem de comer carboidratos por completo.',
        'Transferir a responsabilidade nutricional inteiramente para hospitais secundários.'
      ],
      correctIndex: 1,
      feedbackSuccess: 'Excelente! Hortas comunitárias integram promoção de saúde, sustentabilidade e engajamento social de baixo custo.',
      feedbackError: 'Incorreto. Devemos focar em soluções acessíveis e viáveis dentro da realidade social da comunidade.'
    }
  },
  'casa-dona-maria': {
    id: 'casa-dona-maria',
    title: 'Casa da Dona Maria',
    phase: 1,
    description: 'Dona Maria, 68 anos, hipertensa e diabética, mora sozinha. Durante a visita domiciliar, você percebe medicamentos espalhados pela cozinha e ela relata que "esquece de tomar as pílulas azuis".',
    dialogues: [
      'Dona Maria: "Meu filho, são muitos remédios, minha cabeça fica confusa..."',
      'Filha de Dona Maria: "Eu venho apenas no final de semana, não consigo acompanhar todo dia."'
    ],
    question: {
      text: 'Como melhorar a adesão terapêutica de Dona Maria de forma prática na Atenção Básica?',
      options: [
        'Aumentar as doses dos remédios para compensar os dias em que ela esquece.',
        'Desenvolver uma caixinha organizadora de medicamentos colorida (separada por turnos com desenhos) e envolver um vizinho ou agente comunitário para suporte.',
        'Suspender todos os medicamentos e indicar apenas repouso absoluto.',
        'Internar a paciente em um hospital de custódia.'
      ],
      correctIndex: 1,
      feedbackSuccess: 'Correto! Facilitadores visuais de medicamentos e redes de apoio comunitário/familiar melhoram muito a adesão em idosos.',
      feedbackError: 'Incorreto. Alterar doses sem adesão causa riscos graves de intoxicação ou descompensação clínica.'
    }
  },
  'condominio': {
    id: 'condominio',
    title: 'Condomínio Residencial',
    phase: 1,
    description: 'Um condomínio popular com alta densidade demográfica relata aumento expressivo de casos febris com dores nas articulações nas últimas três semanas.',
    dialogues: [
      'Síndico: "Temos muitas calhas entupidas e água parada nas áreas comuns dos blocos."',
      'Moradora: "Vários vizinhos meus estão de cama com manchas vermelhas no corpo."'
    ],
    question: {
      text: 'Qual hipótese diagnóstica epidemiológica deve ser investigada prioritariamente?',
      options: [
        'Gripe comum estacional.',
        'Surto de arboviroses (Dengue, Zika ou Chikungunya).',
        'Intoxicação alimentar por água encanada.',
        'Alergia coletiva a poeira de construção.'
      ],
      correctIndex: 1,
      feedbackSuccess: 'Excelente! Febre, artralgia, exantema e alta densidade em período de água acumulada sugerem forte surto de arboviroses.',
      feedbackError: 'Incorreto. A presença de água parada nas calhas e o padrão de sintomas apontam para arboviroses transmitidas pelo Aedes aegypti.'
    }
  },

  // --- FASE 2: UBS EXTERNA ---
  'entrada-unidade': {
    id: 'entrada-unidade',
    title: 'Entrada da Unidade',
    phase: 2,
    description: 'Você chega na entrada da UBS e vê uma grande fila de pacientes logo no início da manhã. Muitos estão impacientes e há falta de identificação visual clara sobre o fluxo de atendimento.',
    dialogues: [
      'Paciente na fila: "Cheguei às 5h da manhã para tentar pegar uma senha de consulta, doutor."',
      'Recepcionista: "O sistema de agendamento online está fora do ar hoje."'
    ],
    question: {
      text: 'Qual diretriz da Política Nacional de Humanização (PNH) deve ser implementada para organizar este fluxo?',
      options: [
        'Distribuir senhas por ordem de chegada simples, independentemente da gravidade.',
        'Implementar o Acolhimento com Classificação de Risco (Protocolo Manchester ou similar) para priorizar atendimentos por gravidade clínica.',
        'Fechar a porta da unidade quando atingir 10 atendimentos.',
        'Atender apenas pacientes que tenham agendamento digital prévio.'
      ],
      correctIndex: 1,
      feedbackSuccess: 'Perfeito! O acolhimento com classificação de risco organiza a fila por critérios clínicos e éticos de gravidade, não por ordem de chegada.',
      feedbackError: 'Incorreto. A ordem de chegada simples coloca casos urgentes em risco na fila de espera.'
    }
  },
  'placa-ubs': {
    id: 'placa-ubs',
    title: 'Placa da UBS',
    phase: 2,
    description: 'A placa da unidade define as diretrizes do SUS. Você aproveita para refletir sobre os princípios organizacionais da atenção primária à saúde.',
    dialogues: [
      'Inscrição na Placa: "UBS - Unidade Básica de Saúde. Porta de entrada preferencial do Sistema Único de Saúde."'
    ],
    question: {
      text: 'Quais são os três princípios doutrinários do SUS representados nesta placa institucional?',
      options: [
        'Universalidade, Equidade e Integralidade.',
        'Centralização, Privatização e Regionalização.',
        'Hierarquização, Participação Popular e Resolutividade.',
        'Especialização, Individualidade e Eficiência Privada.'
      ],
      correctIndex: 0,
      feedbackSuccess: 'Exato! Universalidade (acesso a todos), Equidade (tratar desiguais segundo suas necessidades) e Integralidade (cuidado completo) são os três pilares doutrinários.',
      feedbackError: 'Incorreto. Lembre-se dos pilares de direito à saúde do cidadão garantidos constitucionalmente.'
    }
  },
  'ambulancia': {
    id: 'ambulancia',
    title: 'Ambulância',
    phase: 2,
    description: 'Uma ambulância traz um paciente com suspeita de Infarto Agudo do Miocárdio (IAM) para estabilização temporária na sala de emergência da UBS.',
    dialogues: [
      'Socorrista: "Paciente com dor precordial típica irradiada para membro superior esquerdo há 2 horas. ECG mostra supra de ST."'
    ],
    question: {
      text: 'Após realizar as medidas de estabilização inicial (oxigênio, AAS, nitrato se indicado), qual o próximo passo correto?',
      options: [
        'Dar alta ao paciente com encaminhamento para consulta ambulatorial eletiva.',
        'Acionar imediatamente a regulação médica de urgência (SAMU) para transferência rápida a um serviço de hemodinâmica/cardiologia de alta complexidade.',
        'Manter o paciente em observação na UBS por 5 dias sem novos exames.',
        'Realizar uma cirurgia cardíaca de bypass no consultório da UBS.'
      ],
      correctIndex: 1,
      feedbackSuccess: 'Correto! A UBS estabiliza inicialmente, mas casos de IAM necessitam de transferência ágil regulada para terapia de reperfusão coronariana.',
      feedbackError: 'Incorreto. O tempo é crucial no IAM; reter o paciente sem recursos de alta complexidade cardiológica coloca sua vida em risco.'
    }
  },

  // --- FASE 3: UBS INTERNA ---
  'recepcao': {
    id: 'recepcao',
    title: 'Recepção da Unidade',
    phase: 3,
    description: 'Um paciente solicita atendimento imediato por dor lombar intensa. A recepcionista te chama para decidir sobre a abertura de ficha e encaminhamento.',
    dialogues: [
      'Recepcionista: "Doutor, ele não trouxe o cartão do SUS nem o comprovante de residência local."'
    ],
    question: {
      text: 'Diante da falta de documentos de identificação ou comprovante de endereço, qual a conduta da recepção sob as normas do SUS?',
      options: [
        'Negar o atendimento e mandar o paciente retornar com a documentação completa.',
        'Realizar o acolhimento e atendimento imediato, efetuando o cadastro temporário ou regularizando os dados posteriormente.',
        'Cobrar uma taxa social de consulta para compensar a falta de registro.',
        'Encaminhar o paciente para a delegacia de polícia mais próxima.'
      ],
      correctIndex: 1,
      feedbackSuccess: 'Muito bom! O acesso ao SUS é universal. Nenhum atendimento de saúde pode ser negado ou condicionado à apresentação imediata de documentos de cadastro.',
      feedbackError: 'Incorreto. A exigência de burocracias cadastrais não pode impedir o direito constitucional ao atendimento à saúde.'
    }
  },
  'triagem': {
    id: 'triagem',
    title: 'Sala de Triagem',
    phase: 3,
    description: 'Na triagem, você avalia os parâmetros vitais de um senhor de 54 anos: PA: 168/104 mmHg, FC: 82 bpm, Temperatura: 36.6 °C, Glicemia Capilar: 290 mg/dL (pós-prandial). Ele nega sintomas agudos como dor de cabeça ou dor no peito.',
    dialogues: [
      'Técnico de Enfermagem: "Doutor, a pressão dele está alta e o teste do dedinho deu bem alterado."'
    ],
    question: {
      text: 'Como este caso deve ser classificado e manejado na triagem da UBS?',
      options: [
        'Urgência com necessidade de envio em ambulância para UTI imediatamente.',
        'Sem sintomas agudos de lesão de órgão-alvo. Classificar como caso crônico descompensado, acolher para consulta médica no dia de hoje e orientar ajustes de medicação de uso contínuo.',
        'Alergia grave, necessitando de anti-histamínicos intramusculares.',
        'Dar alta imediata sem orientações adicionais.'
      ],
      correctIndex: 1,
      feedbackSuccess: 'Exato! Pacientes com níveis elevados de PA e glicemia sem lesão aguda de órgão-alvo representam descompensações crônicas que devem ser manejadas no dia na UBS, evitando idas desnecessárias à UPA.',
      feedbackError: 'Incorreto. Não há sinais de emergência/lesão de órgão-alvo aguda que justifiquem transporte imediato para UTI.'
    }
  },
  'consultorio': {
    id: 'consultorio',
    title: 'Consultório Médico',
    phase: 3,
    description: 'Você está no consultório analisando a lista de exames laboratoriais de rotina de uma gestante de baixo risco no segundo trimestre.',
    dialogues: [
      'Paciente: "Doutor, meus exames de sangue e urina estão prontos. Está tudo bem com o meu bebê?"'
    ],
    question: {
      text: 'Qual exame de triagem de diabetes gestacional deve ser obrigatoriamente solicitado ou avaliado no pré-natal entre 24 e 28 semanas?',
      options: [
        'Glicemia capilar após jejum de 24 horas.',
        'Teste Oral de Tolerância à Glicose (TOTG 75g).',
        'Hemograma completo quinzenal.',
        'Ultrassonografia tridimensional morfológica diária.'
      ],
      correctIndex: 1,
      feedbackSuccess: 'Perfeito! O TOTG com 75g de glicose é o padrão recomendado no pré-natal para diagnóstico de diabetes gestacional entre as semanas 24 e 28.',
      feedbackError: 'Incorreto. O TOTG 75g é o exame preconizado pelo Ministério da Saúde para o rastreio nessa idade gestacional.'
    }
  },
  'anamnese': {
    id: 'anamnese',
    title: 'Anamnese Clínico',
    phase: 3,
    description: 'Cenário de encerramento da simulação. Você realiza a anamnese detalhada de um paciente jovem que apresenta tosse produtiva diária há mais de 3 semanas, febre vespertina de baixa intensidade e perda de peso inexplicada.',
    dialogues: [
      'Paciente: "Doutor, essa tosse com catarro não passa, e ando suando muito à noite..."'
    ],
    question: {
      text: 'Qual a principal suspeita diagnóstica que exige investigação imediata na Atenção Básica através de baciloscopia de escarro?',
      options: [
        'Pneumonia comunitária viral aguda.',
        'Tuberculose pulmonar.',
        'Asma alérgica sazonal.',
        'DPOC compensado.'
      ],
      correctIndex: 1,
      feedbackSuccess: 'Parabéns! Sintomático respiratório (tosse > 3 semanas), febre vespertina e emagrecimento são a tríade clássica para suspeita de Tuberculose na APS.',
      feedbackError: 'Incorreto. Tosse persistente por mais de 3 semanas em nosso território epidemiológico exige investigação ativa para afastar Tuberculose pulmonar.'
    }
  }
};
