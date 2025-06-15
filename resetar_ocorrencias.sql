-- =======================================================
-- SCRIPT PARA ZERAR COMPLETAMENTE AS OCORRÊNCIAS
-- ATENÇÃO: ESTA AÇÃO É PERMANENTE E IRREVERSÍVEL.
-- =======================================================

-- Passo 1: Apaga todas as linhas da tabela de ocorrências
-- e de qualquer tabela que dependa dela (como fotos_ocorrencias).
TRUNCATE TABLE ocorrencias CASCADE;

-- Passo 2: Reseta o contador de ID da tabela de ocorrências
-- para que a próxima inserção comece em 1.
ALTER SEQUENCE ocorrencias_id_seq RESTART WITH 1;
