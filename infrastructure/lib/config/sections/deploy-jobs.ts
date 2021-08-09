import { getBoolean } from "../utils";

export interface DeployJobsConfig
{
    readonly SparkPi: boolean;
    readonly WeatherData: boolean;
}

export function getConfig(object: { [name: string]: any }): DeployJobsConfig
{
    return {
        SparkPi: getBoolean(object, 'SparkPi'),
        WeatherData: getBoolean(object, 'WeatherData')
    };
}