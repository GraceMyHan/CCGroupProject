# Color & Sounds
Group project of Cloud Computing & Big Data Spring 2019

## Team Member
Yijia Xu(yx2489)
Mengyu Han(mh3881)
Wen Sun (ws2544)

## Introduction
Nowadays,  people  are  spending  large  amount  of  timeon social media to connect with others and share daily lives withfriends. Posting selfies is a popular way to express personal moodand recent updates to social media, especially for woman groups.On the other hand, music is a more engaging way for entertainingcompared to photos. Also, people can easily get access to highlydiverse and huge amount of music from Pandora or Spotify. Tomake the posted selfies more fun to both posters and consumers,we designed a web application to create a music selfie, combinga  song  which  matches  the  mood  of  photo  with  the  selfie.  Thenusers  can  share  this  music  selfie  to  the  public  channel  in  ourapplication.  We  used  a  bunch  of  AWS  services  to  implementour features. Cognito was used to authenticate users and ensurethe system security. Our front-end website and uploaded photosare  stored  in  S3.  We  used  API  Gateways  to  set  up  our  APIs.Rekogtion was used to process photos and classify the selfie intoone  of  seven  kinds  of  mood.  Input  with  the  classification  resultof Rekogtion, Spotify API returned a list of recommended songs.Finally,  SES  service  was  used  to  notify  users  about  the  publicchannel  update.
