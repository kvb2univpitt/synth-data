# Loading Synthetic Data

This is a guide for inserting synthetic data into the i2b2 database for the following tables:

- OBSERVATION_FACT
- PATIENT_DIMENSION
- VISIT_DIMENSION


## Synthetic Data Format

The synthetic data are generated based on the first four patient visits.  Below is the output files containing the synthetic data for the i2b2 tables:

| Synthetic Output File | I2b2 Table        |
|-----------------------|-------------------|
| diagnosis.csv         | OBSERVATION_FACT  |
| observation_fact.csv  | OBSERVATION_FACT  |
| patient_dimension.csv | PATIENT_DIMENSION |
| visit_dimension.csv   | VISIT_DIMENSION   |

The ***diagnosis.csv*** contains only diagnosis ICD codes while the ***observation_fact.csv*** file contains all other ICD codes.

## Loading the Synthetic Data into the I2b2 Database

Assuming the following database configuration:

| Attribute | Value     |
|-----------|-----------|
| Host      | localhost |
| Port      | 5432      |
| Database  | i2b2      |

Assuming the following i2b2 database account:

| User         | Password |
|--------------|----------|
| i2b2demodata | demouser |

### Loading Data in PostgreSQL

The **OBSERVATION_FACT** table in PostgreSQL contains the ***text_search_index*** column for indicing purposes.  This column must be dropped to insert the synthetic data.  The ***text_search_index*** column can later be added back once the synthetic data is loaded.

To drop the ***text_search_index***, execute the following query:

```sql
ALTER TABLE observation_fact DROP COLUMN text_search_index;
```

To import synthetic diagnosis data into the **OBSERVATION_FACT** table, execute the following:

```sql
psql postgresql://i2b2demodata:demouser@localhost:5432/i2b2 -c "\\copy public.observation_fact(encounter_num,patient_num,concept_cd,start_date,provider_id,sourcesystem_cd) FROM 'diagnosis.csv' WITH CSV HEADER DELIMITER E','"
```

To import other synthetic observation fact data into the **OBSERVATION_FACT** table, execute the following:

```sql
psql postgresql://i2b2demodata:demouser@localhost:5432/i2b2 -c "\\copy public.observation_fact(patient_num,encounter_num,start_date,concept_cd,valtype_cd,tval_char,nval_num,units_cd,valueflag_cd,provider_id,sourcesystem_cd) FROM 'observation_fact.csv' WITH CSV HEADER DELIMITER E','"
```

To import other synthetic patient data into the **PATIENT_DIMENSION** table, execute the following:

```sql
psql postgresql://i2b2demodata:demouser@localhost:5432/i2b2 -c "\\copy public.patient_dimension(patient_num,birth_date,race_cd,sex_cd,age_in_years_num,sourcesystem_cd) FROM 'patient_dimension.csv' WITH CSV HEADER DELIMITER E','"
```

To import other synthetic visit data into the **VISIT_DIMENSION** table, execute the following:

```sql
psql postgresql://i2b2demodata:demouser@localhost:5432/i2b2 -c "\\copy public.visit_dimension(encounter_num,patient_num,start_date,sourcesystem_cd) FROM 'visit_dimension.csv' WITH CSV HEADER DELIMITER E','"
```
