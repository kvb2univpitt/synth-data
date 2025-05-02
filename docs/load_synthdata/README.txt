PostgreSQL
================================================================================

List columns from table
----------------------------------------
SELECT column_name
FROM information_schema.COLUMNS
WHERE table_schema = 'public' AND table_name = 'observation_fact'
;

For testing purposes, the 'text_search_index' column needs to be removed from the 'observation_fact' table:
----------------------------------------
ALTER TABLE observation_fact DROP COLUMN text_search_index;


Import data from 'observation_fact.csv' file
----------------------------------------
psql postgresql://i2b2demodata:demouser@localhost:5432/i2b2 -c "\\copy public.observation_fact(patient_num,encounter_num,start_date,concept_cd,valtype_cd,tval_char,nval_num,units_cd,valueflag_cd,provider_id,sourcesystem_cd) FROM 'observation_fact.csv' WITH CSV HEADER DELIMITER E','"


Import data from 'patient_dimension.csv' file
----------------------------------------
psql postgresql://i2b2demodata:demouser@localhost:5432/i2b2 -c "\\copy public.patient_dimension(patient_num,birth_date,race_cd,sex_cd,age_in_years_num,sourcesystem_cd) FROM 'patient_dimension.csv' WITH CSV HEADER DELIMITER E','"
