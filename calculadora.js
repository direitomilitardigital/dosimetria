document.addEventListener('DOMContentLoaded', function() {
    const method1Radio = document.querySelector('input[name="calculationMethod"][value="method1"]');
    const method2Radio = document.querySelector('input[name="calculationMethod"][value="method2"]');
    const maxPenaltySection = document.getElementById('maxPenaltySection');
    const resultadoPenaMinimaLabel = document.getElementById('resultadoPenaMinimaLabel');
    const resultadoPenaMinima = document.getElementById('resultadoPenaMinima');
    const resultadoPenaMediaLabel = document.getElementById('resultadoPenaMediaLabel');
    const resultadoPenaMedia = document.getElementById('resultadoPenaMedia');
    const penaMinimaDiasLabel = document.getElementById('penaMinimaDiasLabel');
    const penaMinimaDias = document.getElementById('penaMinimaDias');

    method1Radio.addEventListener('change', function() {
        maxPenaltySection.style.display = 'none';
        resultadoPenaMinimaLabel.textContent = 'Pena Mínima:';
        resultadoPenaMediaLabel.style.display = 'none';
        resultadoPenaMedia.style.display = 'none';
        penaMinimaDiasLabel.style.display = 'none';
        penaMinimaDias.style.display = 'none';
    });

    method2Radio.addEventListener('change', function() {
        maxPenaltySection.style.display = 'block';
        resultadoPenaMinimaLabel.textContent = 'Pena Mínima:';
        resultadoPenaMediaLabel.style.display = 'block';
        resultadoPenaMedia.style.display = 'block';
        penaMinimaDiasLabel.style.display = 'block';
        penaMinimaDias.style.display = 'block';
    });

    function parseFraction(fraction) {
        const parts = fraction.split('/');
        return parts.length === 2 ? parseInt(parts[0]) / parseInt(parts[1]) : parseFloat(parts[0]);
    }

    function convertDaysToYearsMonthsDays(totalDias) {
        const anos = Math.floor(totalDias / 365);
        const restoDiasAposAnos = totalDias % 365;
        const meses = Math.floor(restoDiasAposAnos / 30);
        const dias = Math.floor(restoDiasAposAnos % 30); // Arredondar para baixo os dias restantes
        return { anos, meses, dias };
    }

    // Função para calcular todas as fases
    function calcularTodasAsFases() {
        // 1ª Fase: Calcular Pena Mínima e Pena Média
        const minAnos = parseInt(document.getElementById('minYears').value) || 0;
        const minMeses = parseInt(document.getElementById('minMonths').value) || 0;
        const minDias = parseInt(document.getElementById('minDays').value) || 0;

        const minMesesEmDias = minMeses * 30;
        const minAnosEmDias = minAnos * 365;
        const totalDiasMin = minAnosEmDias + minMesesEmDias + minDias;

        resultadoPenaMinima.value = `${totalDiasMin} dias`;
        penaMinimaDias.value = `${totalDiasMin} dias`;

        if (method2Radio.checked) {
            const maxAnos = parseInt(document.getElementById('maxYears').value) || 0;
            const maxMeses = parseInt(document.getElementById('maxMonths').value) || 0;
            const maxDias = parseInt(document.getElementById('maxDays').value) || 0;

            const maxMesesEmDias = maxMeses * 30;
            const maxAnosEmDias = maxAnos * 365;
            const totalDiasMax = maxAnosEmDias + maxMesesEmDias + maxDias;

            const penaMedia = (totalDiasMin + totalDiasMax) / 2;

            resultadoPenaMedia.value = `${Math.floor(penaMedia)} dias`; // Arredondar para baixo
        }

        // 2ª Fase: Calcular Pena Base
        const fraçãoPrimeiraFase = parseFraction(document.getElementById('firstPhaseFraction').value) || 0;
        const circunstânciasJudiciais = parseInt(document.getElementById('judicialCircumstances').value) || 0;

        let penaBase;

        if (method2Radio.checked) {
            const penaMedia = Math.floor(parseInt(resultadoPenaMedia.value.split(' ')[0])) || 0;
            penaBase = totalDiasMin + Math.floor((penaMedia * fraçãoPrimeiraFase) * circunstânciasJudiciais);
        } else {
            penaBase = totalDiasMin + Math.floor(circunstânciasJudiciais * (totalDiasMin * fraçãoPrimeiraFase));
        }

        document.getElementById('penaBaseDias').value = penaBase;

        const { anos: anosPenaBase, meses: mesesPenaBase, dias: diasPenaBase } = convertDaysToYearsMonthsDays(penaBase);

        document.getElementById('basePenalty').value = `${anosPenaBase} anos, ${mesesPenaBase} meses, ${diasPenaBase} dias`;

        // 3ª Fase: Calcular Pena Intermediária
        const fraçãoSegundaFase = parseFraction(document.getElementById('intermediateFraction').value) || 0;
        const atenuantes = parseInt(document.getElementById('mitigating').value) || 0;
        const agravantes = parseInt(document.getElementById('aggravating').value) || 0;

        const resultadoParcialX = penaBase * fraçãoSegundaFase;
        const resultadoY = atenuantes - agravantes;

        let penaIntermediariaEmDias = penaBase - Math.floor(resultadoParcialX * resultadoY);

        if (penaIntermediariaEmDias < 0) {
            penaIntermediariaEmDias = 0;
        }

        const { anos: anosPenaIntermediaria, meses: mesesPenaIntermediaria, dias: diasPenaIntermediaria } = convertDaysToYearsMonthsDays(penaIntermediariaEmDias);

        document.getElementById('intermediatePenalty').value = `${Math.floor(penaIntermediariaEmDias)} dias (${anosPenaIntermediaria} anos, ${mesesPenaIntermediaria} meses, ${diasPenaIntermediaria} dias)`;

        // 4ª Fase: Calcular Pena Definitiva
        const fraçãoTerceiraFase = parseFraction(document.getElementById('finalFraction').value) || 0;
        const minorantes = parseInt(document.getElementById('minorantes').value) || 0;
        const majorantes = parseInt(document.getElementById('majorantes').value) || 0;

        const resultadoParcialX3 = penaIntermediariaEmDias * fraçãoTerceiraFase;
        const resultadoY3 = minorantes - majorantes;

        let penaDefinitivaEmDias = penaIntermediariaEmDias - Math.floor(resultadoParcialX3 * resultadoY3);

        if (penaDefinitivaEmDias < 0) {
            penaDefinitivaEmDias = 0;
        }

        const { anos: anosPenaDefinitiva, meses: mesesPenaDefinitiva, dias: diasPenaDefinitiva } = convertDaysToYearsMonthsDays(penaDefinitivaEmDias);

        document.getElementById('finalPenalty').value = `${Math.floor(penaDefinitivaEmDias)} dias (${anosPenaDefinitiva} anos, ${mesesPenaDefinitiva} meses, ${diasPenaDefinitiva} dias)`;
    }

    // Vincular a função ao botão de calcular todas as fases
    document.getElementById('calcularTodasFases').addEventListener('click', calcularTodasAsFases);
});
