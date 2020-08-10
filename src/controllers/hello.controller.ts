// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {get,param,Response,RestBindings} from '@loopback/rest';
import {google, analyticsreporting_v4} from 'googleapis';
import {TokenRepository} from '../repositories';
import {
    repository,
} from '@loopback/repository';
export class HelloController {
  constructor(@repository(TokenRepository)
  public tokenRepository: TokenRepository,) {}
  private YOUR_CLIENT_ID:string="501095674467-42nfkibg9kofi30spdd49ibsgrsgdi1s.apps.googleusercontent.com";
  private YOUR_CLIENT_SECRET:string="vMbPpi83cDGWL9J2Rl9hjBjN";
  private YOUR_REDIRECT_URL:string="https://loopback-analytics.herokuapp.com/oauthcallback";
  public oauth2Client:any=new google.auth.OAuth2(
    this.YOUR_CLIENT_ID,
    this.YOUR_CLIENT_SECRET,
    this.YOUR_REDIRECT_URL
  );
  private bo:any;
  
  @get('/hello')
  async hello(@param.query.string("view_id") viewId: any): Promise<any> {
    const a=this.tokenRepository.find({limit:1})
    const [data]=await a
    this.oauth2Client.setCredentials(data);
        const analyticsreporting = google.analyticsreporting({version:"v4",auth:this.oauth2Client});
    const res = await analyticsreporting.reports.batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: viewId,
            dateRanges: [
              {
                startDate: '30daysAgo',
                endDate: 'yesterday',
              },
              
            ],
            metrics: [
              {
                expression: 'ga:users',
              },
            ],
            dimensions: [
              {
                name: 'ga:date',
              },
            ],
          },
        ],
      },
    });
    
    return res.data;
  }
  
  @get('/oauthcallback')
  async oauthcallback(@param.query.string("code") code: any,@inject(RestBindings.Http.RESPONSE) response: Response): Promise<any>{
    console.log(code)
    const {tokens} = await this.oauth2Client.getToken(code)
    this.tokenRepository.deleteAll()
    // this.oauth2Client.setCredentials(tokens);
    this.tokenRepository.create(tokens)
    response.redirect("/")
  }
  @get('/oauth')
  oauth(@inject(RestBindings.Http.RESPONSE) response: Response): any{
    


// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/analytics.readonly'
];

const url = this.oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes
});
response.redirect(url);
  }
}
