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

## Loading Data in PostgreSQL

### Prerequisites

- PostgreSQL client

### Sample Configuration


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


### Importing Observation Fact

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

### Importing Patient Information

To import other synthetic patient data into the **PATIENT_DIMENSION** table, execute the following:

```sql
psql postgresql://i2b2demodata:demouser@localhost:5432/i2b2 -c "\\copy public.patient_dimension(patient_num,birth_date,race_cd,sex_cd,age_in_years_num,sourcesystem_cd) FROM 'patient_dimension.csv' WITH CSV HEADER DELIMITER E','"
```

### Importing Visit Information

To import other synthetic visit data into the **VISIT_DIMENSION** table, execute the following:

```sql
psql postgresql://i2b2demodata:demouser@localhost:5432/i2b2 -c "\\copy public.visit_dimension(encounter_num,patient_num,start_date,sourcesystem_cd) FROM 'visit_dimension.csv' WITH CSV HEADER DELIMITER E','"
```

## Loading Data in Oracle

### Prerequisites

- Oracle Instant Client.
- Database connection configured using ***tnsnames.ora*** file.

### Sample Configuration


Assuming the following database configuration:

| Attribute | Value     |
|-----------|-----------|
| Host      | localhost |
| Port      | 1521      |
| Database  | i2b2      |

Assuming the following i2b2 database account:

| User         | Password |
|--------------|----------|
| i2b2demodata | demouser |

### Importing Observation Fact

#### Importing Observation Fact Data Containing Only Diagnosis ICD Code

Create the following Oracle database control file called **diagnosis.ctl** in the same directory as the file **diagnosis.csv**:

```sql
options (direct=true,skip=1)
LOAD data
infile 'diagnosis.csv'
append
into table OBSERVATION_FACT
fields terminated by ','
trailing nullcols
(
    ENCOUNTER_NUM,
    PATIENT_NUM,
    CONCEPT_CD,
    START_DATE DATE 'YYYY-MM-DD',
    PROVIDER_ID,
    SOURCESYSTEM_CD
)
```

Execute the following command to import data:

```
sqlldr i2b2demodata/'demouser'@i2b2 control="diagnosis.ctl"
```

#### Importing Observation Fact Data Containing All Other ICD Codes

Create the following Oracle database control file called **observation_fact.ctl** in the same directory as the file **observation_fact.csv**:

```sql
options (direct=true,skip=1)
LOAD data
infile 'observation_fact.csv'
append
into table OBSERVATION_FACT
fields terminated by ','
OPTIONALLY ENCLOSED BY '"'
trailing nullcols
(
    PATIENT_NUM,
    ENCOUNTER_NUM,
    START_DATE DATE 'YYYY-MM-DD HH24:MI:SS',
    CONCEPT_CD,
    VALTYPE_CD,
    TVAL_CHAR,
    NVAL_NUM,
    UNITS_CD,
    VALUEFLAG_CD,
    PROVIDER_ID,
    SOURCESYSTEM_CD
)
```

Execute the following command to import data:

```
sqlldr i2b2demodata/'demouser'@i2b2 control="observation_fact.ctl"
```

### Importing Patient Dimension

Create the following Oracle database control file called **patient_dimension.ctl** in the same directory as the file **patient_dimension.csv**:

```sql
options (direct=true,skip=1)
LOAD data
infile 'patient_dimension.csv'
append
into table PATIENT_DIMENSION
fields terminated by ','
trailing nullcols
(
    PATIENT_NUM,
    BIRTH_DATE DATE 'YYYY-MM-DD',
    RACE_CD,
    SEX_CD,
    AGE_IN_YEARS_NUM,
    SOURCESYSTEM_CD
)
```

Execute the following command to import data:

```
sqlldr i2b2demodata/'demouser'@i2b2 control="patient_dimension.ctl"
```

### Importing Visit Dimension

Create the following Oracle database control file called **visit_dimension.ctl** in the same directory as the file **visit_dimension.csv**:

```sql
options (direct=true,skip=1)
LOAD data
infile 'visit_dimension.csv'
append
into table VISIT_DIMENSION
fields terminated by ','
trailing nullcols
(
    ENCOUNTER_NUM,
    PATIENT_NUM,
    START_DATE DATE 'YYYY-MM-DD',
    SOURCESYSTEM_CD
)
```

Execute the following command to import data:

```
sqlldr i2b2demodata/'demouser'@i2b2 control="visit_dimension.ctl"
```
