
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

let DA = [NaN, NaN];
let DB = [NaN, NaN];

module.exports.t2pSolucion = (parametros) => {

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


