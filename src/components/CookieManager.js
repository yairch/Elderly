import Cookies from 'universal-cookie';
import axios from 'axios'
const cookies = new Cookies();

const types = ["calories", "steps", "speed", "active_min", "distance", "heart_min"]

// for authentication persistance
export const SetCookie = (userData) => {
    const option = {maxAge: 3600};
    for(const [key, value] of Object.entries(userData)) {
        cookies.set(key, value, option);
    };
}

export const DeleteCookie = (fields) => {
    fields.forEach((field) => {
        cookies.remove(field);
    });
}

export const hasCookie = () => {
    const fields = ['accessToken', 'email', 'givenName', 'familyName', 'imageUrl', 'name', 'googleId'];
    const obj = {
        haslogin: false
    };
    if (cookies.get('accessToken')) {
        obj.haslogin = true;
        fields.forEach((field) => {
            obj[field] = cookies.get(field) || 'lorem ipsum'
        });
    }
    return obj;
}

// For saving the reload data for an hour
export const setReloadCookie = () => {
    const currTime = new Date();
    cookies.set('lastReload', currTime.getTime(), {
        maxAge: 3600
    });
}

export const hasReloadCookie = () => {
    if (cookies.get('lastReload')) {
        return {
            'present': true,
            'date': parseInt(cookies.get('lastReload'))
        };
    }
    return {
        'present': false
    };
}

export const pullFromApi = async(response, type ,bucketByTime, start, end) =>{
    let stepArray = []
    try {
        const result = await axios({
            method: "POST",
            headers: {
                authorization: "Bearer " + response.accessToken
            },
            "Content-Type": "application/json",
            url: `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
            data:{
                "aggregateBy": [{
                    "dataTypeName": "com.google.calories.expended",
                  }, {
                    "dataTypeName": "com.google.step_count.delta",
                  }, 
                  {
                    "dataTypeName": "com.google.speed",
                  },
                   {
                    "dataTypeName": "com.google.active_minutes",
                  },
                   {
                    "dataTypeName": "com.google.distance.delta",
                  },
                   {
                    "dataTypeName": "com.google.heart_minutes",
                  },
                ],
                 "bucketByTime": {durationMillis: bucketByTime},
                 "startTimeMillis": start,//1648760850628,
                 "endTimeMillis": end //1649106450628
            }
        });
        stepArray = result.data.bucket
        //console.log(stepArray)
        let i = 1
        let all_types = []
        let steps = []
        let hr = []
        let calories = []
        let speed = []
        let active_min = []
        let distance = []
        for(const dataSet of stepArray){
            all_types.push({[type + i]:[]})
            // console.log('day ' + i)
            let j=0
            for(const points of dataSet.dataset){
                // console.log(points)
                for(const step of points.point){
                    let value = step.value[0] || 0
                    value = value.fpVal || value.intVal || 0
                    if (types[j] === "calories"){
                        calories.push({[type + i]:value})
                    }
                    if (types[j] === "steps"){
                        steps.push({[type + i]:value})
                    }
                    if (types[j] === "speed"){
                        speed.push({[type + i]:value})
                    }
                    if (types[j] === "active_min"){
                        active_min.push({[type + i]:value})
                    }
                    if (types[j] === "distance"){
                        distance.push({[type + i]:value})
                    }
                    if (types[j] === "heart_min"){
                        hr.push({[type + i]:value})
                    }
                    all_types[i-1][type + i].push({[types[j]] : value})
                }
                j+=1
            }
            i+=1
        }
        // console.log(calories)
        // console.log(steps)
        // console.log(speed)
        // console.log(active_min)
        // console.log(distance)
        // console.log(hr)
        return {"calories":calories, "steps": steps, "speed": speed, "active_min":active_min, "distance":distance, "hr":hr}
    }catch (error) {
        console.log(error);
    }
}