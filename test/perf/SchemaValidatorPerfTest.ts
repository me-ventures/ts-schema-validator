import {assert as Assert } from "chai";
import {} from "mocha";
import { SchemaProvider } from "../../src";
import { SchemaValidatorProvider } from "../../src/SchemaValidatorProvider";
import { UsageStats } from "../helpers/UsageStats";
import { ISampleInterface } from "../samples/ISampleInterface";
import { ISampleInterfaceWithOptionals } from "../samples/ISampleInterfaceWithOptionals";

describe(`SchemaValidator Performance Test`, function(){
    this.timeout(60000);

    describe(`validate`, function(){

        it(`should run very fast without validation (for reference only)`, async function(){
            const stats = new UsageStats();
            stats.start();
            for ( let i = 0; i < 10000; i++ ) {
                const testObject: ISampleInterface = {
                    booleanThing: true,
                    numberThing: i,
                    stringThing: "abc"
                };

                testObject.numberThing += 10;
            }

            console.log(stats.stop());
        });

        it(`should validate 10000 objects within 2.5s with validation`, async function(){
            const provider = new SchemaValidatorProvider();

            const schemaProvider = new SchemaProvider({
                path: "test/samples/ISampleInterface.ts"
            });

            const schema = schemaProvider.getSchemaForSymbol("ISampleInterface");

            const validator = provider.getValidator(schema);

            const stats = new UsageStats();
            stats.start();
            for ( let i = 0; i < 10000; i++ ) {
                const testObject: ISampleInterface = {
                    booleanThing: true,
                    numberThing: i,
                    stringThing: "abc"
                };

                testObject.numberThing += 10;

                await validator.validate(testObject);
            }

            const statsResults = stats.stop();

            Assert.isBelow(statsResults.runTime, 2500);
            console.log("validate", statsResults);
        });
    });

    describe(`validateSync`, function(){
        it(`should run very fast without validation (for reference only)`, async function(){
            const stats = new UsageStats();
            stats.start();
            for ( let i = 0; i < 10000; i++ ) {
                const testObject: ISampleInterface = {
                    booleanThing: true,
                    numberThing: i,
                    stringThing: "abc"
                };

                testObject.numberThing += 10;
            }

            console.log(stats.stop());
        });

        it(`should validate 10000 objects within 2.5s with validation`, async function(){
            const provider = new SchemaValidatorProvider();

            const schemaProvider = new SchemaProvider({
                path: "test/samples/ISampleInterface.ts"
            });

            const schema = schemaProvider.getSchemaForSymbol("ISampleInterface");

            const validator = provider.getValidator(schema);

            const stats = new UsageStats();
            stats.start();
            for ( let i = 0; i < 10000; i++ ) {
                const testObject: ISampleInterface = {
                    booleanThing: true,
                    numberThing: i,
                    stringThing: "abc"
                };

                testObject.numberThing += 10;

                validator.validateSync(testObject);
            }

            const statsResults = stats.stop();

            Assert.isBelow(statsResults.runTime, 2500);
            console.log("validateSync", statsResults);

        });
    });

});
