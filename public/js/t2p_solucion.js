
let DA = [NaN, NaN];
let DB = [NaN, NaN];

const t2pSolucion = (parametros) => {

    const precioA = (cmg) => {
        return cmg
    }
    
    const precioB = (dAlta, dBaja, proporcionA, costoMarginal) => {
        return ((proporcionA * (dBaja[0] - dAlta[0])) - ((1-proporcionA) * dBaja[1] * costoMarginal)) / (
            (proporcionA * (dBaja[1] - dAlta[1])) - ((1-proporcionA) * dBaja[1])
        )
    }
    
    const cantDem = (d, precio) => {
        return d[0] - d[1]*precio
    }
    
    const excedente = (d,precio) => {
        return (((d[0]/d[1])-precio)* cantDem(d,precio))/2
    }
    
    const cfB = (dB,pB) => {
        return excedente(dB,pB)
    }
    
    const cfA = (dA, dB, pA, pB) => {
        return excedente(dA,pA) - excedente(dA,pB) + cfB(dB,pB)
    }
    
    const beneficiosTotales = (numeroClientes, proporcionA, dA, dB, precioA, precioB, costoMarginal, costoFijo) => {
        return (numeroClientes * ((proporcionA)*(cantDem(dA,precioA)*(precioA-costoMarginal) + cfA(dA,dB,precioA,precioB)) + (1-proporcionA)*(cantDem(dB,precioB)*(precioB-costoMarginal)+cfB(dB,precioB))) - costoFijo)
    }

    let solucion = {
        cargoFijoA : 0,
        precioA : 0,
        cargoFijoB : 0,
        precioB : 0,
        cantidadA : 0,
        cantidadB : 0,
        cantidadTotal : 0,
        excedenteConsumidorA: 0,
        excedenteConsumidorB: 0,
        costoTotal: 0,
        costosFijos: 0,
        costosVariables: 0,
        costoMedio: 0,
        beneficiosTotales : 0,
        beneficiosConsumidoresA: 0,
        beneficiosConsumidoresB: 0,
        restriccionParticipacionA: false,
        restriccionParticipacionB: false,
        restriccionCompIncentivosA: false,
        restriccionCompIncentivosB: false,
    }

    if (parametros !== 0) {
        // Guardamos los parámetros necesarios para el cálculo de los resultados
        DA[0] = Number(parametros.constant_1);
        DA[1] = Number(parametros.slope_1);
        DB[0] = Number(parametros.constant_2);
        DB[1] = Number(parametros.slope_2);
        let propA = Number(parametros.proporcion);
        let numeroClientes = Number(parametros.numero_clientes);
        let cf = Number(parametros.costo_fijo);
        let cmg = Number(parametros.costo_marginal);

        // Cálculo de tarifas
        let pA = precioA(cmg);
        solucion.precioA = pA

        let pB = precioB(DA, DB, propA, cmg);
        solucion.precioB = pB

        let cargoFijoA = cfA(DA, DB, pA, pB);
        solucion.cargoFijoA = cargoFijoA

        let cargoFijoB = cfB(DB, pB);
        solucion.cargoFijoB = cargoFijoB

        // cantidades demandadas
        let qa = cantDem(DA, pA);
        solucion.cantidadA = qa
        let qb = cantDem(DB, pB);
        solucion.cantidadB = qb
        let Q = numeroClientes * (propA * qa + (1 - propA) * qb);
        solucion.cantidadTotal = Q

        // Costos
        let CT = cf + cmg * Q;
        solucion.costoTotal = CT

        solucion.costosFijos = cf

        let CV = cmg * Q;
        solucion.costosVariables = CV

        let CMe = CT / Q;
        solucion.costoMedio = CMe

        // Excedentes del consumidor
        let ecA = excedente(DA, pA);
        solucion.excedenteConsumidorA = ecA
        let ecB = excedente(DB, pB);
        solucion.excedenteConsumidorB = ecB

        // Beneficios
        solucion.beneficiosTotales = beneficiosTotales(numeroClientes, propA, DA, DB, pA, pB, cmg, cf)
        
        // Restricción de compatibilidad de incentivos

        if (ecA >= cargoFijoA) {
            solucion.restriccionParticipacionA = true
        }

        if (ecB >= cargoFijoB) {
            solucion.restriccionParticipacionB = true
        }

        // Restricción de compatibilidad de incentivos
        if ((ecA - cargoFijoA) >= (excedente(DA,pB)-cargoFijoB)) {
            solucion.restriccionCompIncentivosA = true
        }
        if ((ecB - cargoFijoB) >= (excedente(DB,pA)-cargoFijoA)) {
            solucion.restriccionCompIncentivosB = true
        }
    }
    
    return solucion
}

const form = document.getElementById("input-parametros")
form.addEventListener('submit', function (event) {
    event.preventDefault();

    let constantA = Number(form.elements.constant_1.value);
    let constantB = Number(form.elements.constant_2.value);
    let slopeA = Number(form.elements.slope_1.value);
    let slopeB = Number(form.elements.slope_2.value);
    let numClientes = Number(form.elements.numero_clientes.value);
    let prop = Number(form.elements.proporcion.value);
    let costoFijo = Number(form.elements.costo_fijo.value);
    let costoMarginal = Number(form.elements.costo_marginal.value);

    const parametros = {
        constant_1: constantA,
        slope_1: slopeA,
        constant_2: constantB,
        slope_2: slopeB,
        numero_clientes: numClientes,
        proporcion: prop,
        costo_fijo: costoFijo,
        costo_marginal: costoMarginal,
        max_disp_pagar_1: constantA/slopeA,
        max_disp_pagar_2: constantB/slopeB
    };
    
    let solucion = t2pSolucion(parametros)
    //Tarifas
    document.querySelector("#solCFB").innerText = `$ ${solucion.cargoFijoA}`
    document.querySelector("#solCFA").innerText = `$ ${solucion.cargoFijoB}`
    document.querySelector("#solPA").innerText = `$ ${solucion.precioA}`
    document.querySelector("#solPB").innerText = `$ ${solucion.precioB}`
    // Cantidades demandadas
    document.getElementById("solCantA").innerText = `${solucion.cantidadA}`
    document.getElementById("solCantB").innerText = `${solucion.cantidadB}`
    document.getElementById("solCantTotal").innerText = `${solucion.cantidadTotal}`
    // Costos
    document.getElementById("solCostoFijo").innerText = `$ ${solucion.costosFijos}`
    document.getElementById("solCostoVariable").innerText = `$ ${solucion.costosVariables}`
    document.getElementById("solCostosTotales").innerText = `$ ${solucion.costoTotal}`
    //Beneficios
    document.getElementById("solBeneficios").innerText = `$ ${solucion.beneficiosTotales}`

    //Restricciones
    document.querySelector("#solECA").innerText = `$ ${solucion.excedenteConsumidorA}`
    document.querySelector("#solECB").innerText = `$ ${solucion.excedenteConsumidorB}`


    if (!(solucion.restriccionParticipacionA)) {
        document.querySelector("#RPA").className = "warning"
    };
    if (!(solucion.restriccionParticipacionB)) {
        document.querySelector("#RPB").className = "warning"
    };
    if (!(solucion.restriccionCompIncentivosA)) {
        document.querySelector("#RCIA").className = "warning"
    };
    if (!(solucion.restriccionCompIncentivosB)) {
        document.querySelector("#RCIB").className = "warning"
    };

    const canvas = document.getElementById("t2p_graph");

    const heigthUnit = canvas.height / 8;
    const widthUnit = canvas.width / 8;
    const heigthSubUnit = heigthUnit / 8;
    const widthSubUnit = widthUnit / 8;

    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.reset()
        // Ejes
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(widthUnit, heigthUnit);
        ctx.lineTo(widthUnit, heigthUnit * 7);
        ctx.lineTo(widthUnit * 7, heigthUnit * 7);
        ctx.stroke();

        // flechas ejes
        ctx.beginPath();
        ctx.moveTo(widthUnit - widthSubUnit, heigthUnit);
        ctx.lineTo(widthUnit + widthSubUnit, heigthUnit);
        ctx.lineTo(widthUnit, heigthUnit - widthSubUnit * 2);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(widthUnit * 7, heigthUnit * 7 - heigthUnit / 8);
        ctx.lineTo(widthUnit * 7, heigthUnit * 7 + heigthUnit / 8);
        ctx.lineTo(widthUnit * 7 + widthSubUnit * 2, heigthUnit * 7);
        ctx.closePath();
        ctx.fill();

        // Nombres ejes
        ctx.font = `${widthSubUnit * 3}px sans-serif`;
        ctx.fillText("P", widthUnit - widthSubUnit * 4, heigthUnit - heigthSubUnit);
        ctx.fillText("Q", widthUnit * 7 + widthSubUnit, heigthUnit * 7 + heigthSubUnit * 4);

        // Curvas de demanda

        const maxDispPagar = Math.max(parametros.max_disp_pagar_1, parametros.max_disp_pagar_2);
        
        ctx.strokeStyle = "rgb(229, 45, 35)";
        ctx.beginPath();
        ctx.moveTo(widthUnit, heigthUnit * 2);
        ctx.lineTo(widthUnit * 6, heigthUnit * 7);
        ctx.stroke();

        ctx.strokeStyle = "rgb(0, 130, 252)";
        ctx.beginPath();
        ctx.moveTo(widthUnit, heigthUnit * 3);
        ctx.lineTo(widthUnit * 5, heigthUnit * 7);
        ctx.stroke();

        // Intersección con ejes
        // --------------  Solución  --------------- //
        // Costo Marginal

        ctx.fillText(`pb = ${solucion.precioB}`, widthUnit * 4, heigthUnit * 4);

        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.beginPath();
        ctx.moveTo(widthUnit, posPrecioB );
        ctx.lineTo(widthUnit*7,posPrecioB )
        ctx.stroke();
        // Precio Cliente Demanda Baja
        // Intersección con eje Y
    }

})

