import * as lib from '../src'

const testScript1 = [
    "'asd' fff"
]

const testScript5 = [
    "SET ANSI_NULLS ON",
    "GO",
    "SET QUOTED_IDENTIFIER ON",
    "GO",
    "-- Create the stored procedure in the specified schema",
    "ALTER PROCEDURE [dbo].[sp1]",
    "    @param1 /*parameter name*/ int /*datatype_for_param1*/ = 0, /*default_value_for_param1*/",
    "    @param2 /*parameter's name*/ int /*datatype_for_param1*/ = 0 /*default_value_for_param2*/",
    "-- add more stored ' procedure parameters here",
    "AS",
    "BEGIN",
    "    -- body of the stored procedure",
    "    /*/* mssqldev1.master.    sys.databases */*/",
    "",
    "    --/*",
    "",
    "    DECLARE @a VARCHAR(MAX) = 'PRINT ''hello'''",
    "    PRINT 'mssqldev1.master.sys.databases'",
    "",
    "    SELECT 'aaaa', /*'bbbb'*/* FROM self.master.sys.databases",
    "    SELECT * FROM self.TEST.dbo.Table1",
    "    --*/",
    "    --SELECT * FROM [mssqldev1].master.sys.databases;  ",
    "END",
    "GO"
]

const refiner = lib.Create(testScript1);
refiner.parse('#')

refiner.Text.forEach((t, i) => {
    console.log(`${i}    >${t}<`)
})
