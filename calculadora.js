document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('penaltyForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio do formulário

        // Função para converter fração em decimal
        function parseFraction(fraction) {
            const parts = fraction.split('/');
            return parts.length === 2 ? parseInt(parts[0]) / parseInt(parts[1]) : parseFloat(parts[0]);
        }

        // Função para converter dias para anos, meses e dias
        function convertDaysToYearsMonthsDays(totalDias) {
            const anos = Math.floor(totalDias / 365);
            const restoDiasAposAnos = totalDias % 365;
            const meses = Math.floor(restoDiasAposAnos / 30);
            const dias = restoDiasAposAnos % 30;
            return { anos, meses, dias };
        }

        // Obter valores dos campos de entrada
        const anos = parseInt(document.getElementById('years').value) || 0;
        const meses = parseInt(document.getElementById('months').value) || 0;
        const dias = parseInt(document.getElementById('days').value) || 0;

        // Converter anos e meses para dias
        const mesesEmDias = meses * 30; // Aproximando cada mês como 30 dias
        const anosEmDias = anos * 365; // Aproximando cada ano como 365 dias

        // Somar todos os dias para obter a pena mínima total em dias
        const totalDias = anosEmDias + mesesEmDias + dias;

        // Atualizar o campo de exibição da pena mínima em dias
        document.getElementById('resultadoPenaMinima').value = totalDias + ' dias';

        // Obter a fração da primeira fase e o número de circunstâncias judiciais
        const fraçãoPrimeiraFase = parseFraction(document.getElementById('firstPhaseFraction').value) || 0;
        const circunstânciasJudiciais = parseInt(document.getElementById('judicialCircumstances').value) || 0;

        // Calcular a pena base usando a fórmula fornecida:
        // Pena Base = Pena Mínima + (Circunstâncias Judiciais * Fração * Pena Mínima)
        const aumentoCircunstâncias = circunstânciasJudiciais * fraçãoPrimeiraFase * totalDias;
        const penaBase = totalDias + aumentoCircunstâncias;

        // Converter a pena base de dias para anos, meses e dias
        const { anos: anosPenaBase, meses: mesesPenaBase, dias: diasPenaBase } = convertDaysToYearsMonthsDays(penaBase);

        // Atualizar o campo da pena base com o resultado em anos, meses e dias
        document.getElementById('basePenalty').value = `${anosPenaBase} anos, ${mesesPenaBase} meses, ${diasPenaBase} dias`;

       // Segunda fase - Calcular a pena intermediária
    // Obter fração para a segunda fase
    const fraçãoSegundaFase = parseFraction(document.getElementById('intermediateFraction').value) || 0;

    // Calcular o valor "x"
    const resultadoParcialX = penaBase * fraçãoSegundaFase;

    // Obter número de atenuantes e agravantes
    const atenuantes = parseInt(document.getElementById('mitigating').value) || 0;
    const agravantes = parseInt(document.getElementById('aggravating').value) || 0;

    // Calcular o valor "y"
    const resultadoY = atenuantes - agravantes;

    // Calcular a pena intermediária: pena base - (resultadoParcialX * resultadoY)
    const penaIntermediaria = penaBase - (resultadoParcialX * resultadoY);

    // Converter a pena intermediária de dias para anos, meses e dias
    const { anos: anosPenaIntermediaria, meses: mesesPenaIntermediaria, dias: diasPenaIntermediaria } = convertDaysToYearsMonthsDays(penaIntermediaria);

    // Atualizar o campo da pena intermediária com o resultado em anos, meses e dias
    document.getElementById('intermediatePenalty').value = `${anosPenaIntermediaria} anos, ${mesesPenaIntermediaria} meses, ${diasPenaIntermediaria} dias`;
// Terceira fase - Calcular a pena definitiva
const fraçãoTerceiraFase = parseFraction(document.getElementById('finalFraction').value) || 0;
const minorantes = parseInt(document.getElementById('minorantes').value) || 0;
const majorantes = parseInt(document.getElementById('majorantes').value) || 0;

// Calcular o valor "x" da terceira fase
const resultadoParcialX3 = penaIntermediaria * fraçãoTerceiraFase;

// Calcular o valor "y" da terceira fase
const resultadoY3 = minorantes - majorantes;

// Calcular a pena definitiva: pena intermediária - (resultadoParcialX3 * resultadoY3)
const penaDefinitiva = penaIntermediaria - (resultadoParcialX3 * resultadoY3);

// Converter a pena definitiva de dias para anos, meses e dias
const { anos: anosPenaDefinitiva, meses: mesesPenaDefinitiva, dias: diasPenaDefinitiva } = convertDaysToYearsMonthsDays(penaDefinitiva);

// Atualizar o campo da pena definitiva com o resultado em anos, meses e dias
document.getElementById('finalPenalty').value = `${anosPenaDefinitiva} anos, ${mesesPenaDefinitiva} meses, ${diasPenaDefinitiva} dias`;
});
});