import { LightningElement, track } from 'lwc';
import { createMessageContext, subscribe } from 'lightning/messageService';
import trackingChannel from "@salesforce/messageChannel/trackingChannel__c";

export default class Tracking extends LightningElement {
    @track trackingNumber = '140804273829';
    @track _msg = '';
    @track receivedMessage = '';
    channel;
    context = createMessageContext();

    constructor(){
        super();
        this.subscribeMC();
    }

    subscribeMC() {
        const parent = this;
        parent.receivedMessage = "subscribing...";
        this.channel = subscribe(this.context, trackingChannel,
            function (event) {
                if (event != null) {
                    const message = event.messageBody;
                    const source = event.source;
                    parent.receivedMessage = 'Message: ' + message + '. Sent From: ' + source;
                }
            }
        );
        parent.receivedMessage = "subscribed...";
    }

    changeHandler(event) {
        this.trackingNumber = event.target.value;
    }

    inquireTrack() {
        let parent = this;
        let url = "https://www.fedex.com/trackingCal/track";
        let postJson = {
            "TrackPackagesRequest":
            {
                "appType": "WTRK",
                "appDeviceType": "DESKTOP",
                "supportHTML": true,
                "supportCurrentLocation": true,
                "uniqueKey": "",
                "processingParameters": {},
                "trackingInfoList": [
                    {
                        "trackNumberInfo":
                        {
                            "trackingNumber": parent.trackingNumber,
                            "trackingQualifier": "", "trackingCarrier": ""
                        }
                    }
                ]
            }
        };
        let data = "data=%7B%22TrackPackagesRequest%22%3A%7B%22appType%22%3A%22WTRK%22%2C%22appDeviceType%22%3A%22DESKTOP%22%2C%22supportHTML%22%3Atrue%2C%22supportCurrentLocation%22%3Atrue%2C%22uniqueKey%22%3A%22%22%2C%22processingParameters%22%3A%7B%7D%2C%22trackingInfoList%22%3A%5B%7B%22trackNumberInfo%22%3A%7B%22trackingNumber%22%3A%22" + parent.trackingNumber + "%22%2C%22trackingQualifier%22%3A%22%22%2C%22trackingCarrier%22%3A%22%22%7D%7D%5D%7D%7D&action=trackpackages&locale=en_US&version=1&format=json"
        // let data = "data="+JSON.stringify(postJson)+"&action=trackpackages&version=1&format=json";
        fetch(url, {
            method: "POST",
            body: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((trackingResponse) => {
                parent.receivedMessage = JSON.stringify(trackingResponse);
                console.log(trackingResponse);
            });
    }
}