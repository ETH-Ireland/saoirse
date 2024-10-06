# Strava Schema Documentation

## Introduction

The ZKPass schemas are part of a system that allows users to selectively reveal verified data about their athletic activities. This system empowers people to maintain control over their personal data while still being able to prove specific claims about their activities - for many reasons, in this case monetizing.

## Schema Overview

We have four different Strava schemas, each designed to verify a specific aspect of a user's running activities:

1. Multiple Runs and Total Distance
2. 10k Run Performance
3. 5k Run Performance
4. Location-specific Run (Rome)

Let's break down each schema and discuss its potential applications.

### 1. Multiple Runs and Total Distance

```json
{
  "issuer": "Strava",
  "desc": "Strava connects millions of runners, cyclists, hikers, walkers and other active people through the sports they love",
  "website": "https://www.strava.com/athlete/training",
  "APIs": [
    {
      "host": "www.strava.com",
      "intercept": {
        "url": "athlete/training_activities",
        "method": "GET"
      },
      "override": {
        "url": "api/v3/athlete/activities"
      },
      "assert": [
        {
          "key": "filter|type,Run|length",
          "value": "10",
          "operation": ">="
        },
        {
          "key": "filter|type,Run|sum|distance",
          "value": "50000",
          "operation": ">="
        }
      ]
    }
  ],
  "HRCondition": [
    "Completed at least 10 runs",
    "Total running distance of at least 50km"
  ],
  "tips": {
    "message": "After logging in to Strava, navigate to your Training Log page and click 'Start' to begin the verification process."
  },
  "category": "Healthcare",
  "id": "0x9d023efa242145e196f318d801bbbe87"
}
```

This schema verifies that a user has completed at least 10 runs with a total distance of at least 50km. 

**Potential Use Cases:**
- Fitness challenges or competitions that require a minimum level of activity
- Health insurance programs offering discounts for active lifestyles
- Workplace wellness programs verifying employee participation

### 2. 10k Run Performance

```json
{
  "issuer": "Strava",
  "desc": "Strava connects millions of runners, cyclists, hikers, walkers and other active people through the sports they love",
  "website": "https://www.strava.com/athlete/training",
  "APIs": [
    {
      "host": "www.strava.com",
      "intercept": {
        "url": "athlete/training_activities",
        "method": "GET"
      },
      "override": {
        "url": "api/v3/athlete/activities"
      },
      "assert": [
        {
          "key": "filter|type,Run&distance,>=,10000&moving_time,<=,4200|length",
          "value": "1",
          "operation": ">="
        }
      ]
    }
  ],
  "HRCondition": [
    "Completed at least one 10k run in under 70 minutes"
  ],
  "tips": {
    "message": "After logging in to Strava, navigate to your Training Log page and click 'Start' to begin the verification process. Make sure you have at least one 10k run completed in under 70 minutes."
  },
  "category": "Healthcare",
  "id": "0xb51520c52da1429cb397e083e493ffb6"
}
```

This schema verifies that a user has completed at least one 10k run in under 70 minutes.

**Potential Use Cases:**
- Race qualification verification
- Performance-based rewards programs
- Coaching or training program admission

### 3. 5k Run Performance

```json
{
  "issuer": "Strava",
  "desc": "Strava connects millions of runners, cyclists, hikers, walkers and other active people through the sports they love",
  "website": "https://www.strava.com/athlete/training",
  "APIs": [
    {
      "host": "www.strava.com",
      "intercept": {
        "url": "athlete/training_activities",
        "method": "GET"
      },
      "override": {
        "url": "api/v3/athlete/activities"
      },
      "assert": [
        {
          "key": "filter|type,Run&distance,>=,5000&moving_time,<=,1800|length",
          "value": "1",
          "operation": ">="
        }
      ]
    }
  ],
  "HRCondition": [
    "Completed at least one 5k run in under 30 minutes"
  ],
  "tips": {
    "message": "After logging in to Strava, navigate to your Training Log page and click 'Start' to begin the verification process. Make sure you have at least one 5k run completed in under 30 minutes."
  },
  "category": "Healthcare",
  "id": "0x283e67e7cc94442b800fd104990e7a1e"
}
```

This schema verifies that a user has completed at least one 5k run in under 30 minutes.

**Potential Use Cases:**
- Fitness level verification for job applications (e.g., military, law enforcement)
- Eligibility for advanced running clubs or teams
- Personalized fitness product recommendations

### 4. Location-specific Run (Rome)

```json
{
    "issuer": "Strava",
    "desc": "Strava connects millions of runners, cyclists, hikers, walkers and other active people through the sports they love",
    "website": "https://www.strava.com/athlete/training",
    "APIs": [
      {
        "host": "www.strava.com",
        "intercept": {
          "url": "athlete/training_activities",
          "method": "GET"
        },
        "override": {
          "url": "api/v3/athlete/activities"
        },
        "assert": [
          {
            "key": "filter|type,Run&start_latlng.0,>=,41.8&start_latlng.0,<=,42.0&start_latlng.1,>=,12.4&start_latlng.1,<=,12.6|length",
            "value": "1",
            "operation": ">="
          }
        ]
      }
    ],
    "HRCondition": [
      "Completed at least one run in Rome"
    ],
    "tips": {
      "message": "After logging in to Strava, navigate to your Training Log page and click 'Start' to begin the verification process. Make sure you have recorded at least one run in Rome."
    },
    "category": "Healthcare",
    "id": "0x109dd464f8084ba49f65f2190224fd82"
}
```

This schema verifies that a user has completed at least one run in Rome (based on specified latitude and longitude ranges).

**Potential Use Cases:**
- Travel or tourism verification for rewards programs
- Location-based challenges or competitions
- Proof of presence for event participation