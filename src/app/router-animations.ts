/**
 * Credit: https://medium.com/google-developer-experts/angular-supercharge-your-router-transitions-using-new-animation-features-v4-3-3eb341ede6c8
 */

import {trigger, animate, style, group, query, transition} from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
  transition(
    'details => list',
    [
      query(
        ':enter, :leave',
        style({ position: 'fixed', width: '100%' }),
        { optional: true }
      ),
      group([
        query(
          ':enter',
          [
            style({ transform: 'translateX(-150%)' }),
            animate('.25s ease-in-out', style({ transform: 'translateX(-50%)' }))
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            style({ transform: 'translateX(-50%)' }),
            animate('.25s ease-in-out', style({ transform: 'translateX(50%)' }))
          ],
          { optional: true }
        ),
      ])
    ]
  ),
  transition(
    'list => details',
    [
      group(
        [
          query(
            ':enter, :leave',
            style({ position: 'fixed', width: '100%' }),
            // { optional: true }
          ),
          query(
            ':enter',
            [
              style({ transform: 'translateX(50%)' }),
              animate('0.25s ease-in-out', style({ transform: 'translateX(-50%)' }))
            ],
            { optional: true }
          ),
          query(
            ':leave',
            [
              style({ transform: 'translateX(-50%)' }),
              animate('0.25s ease-in-out', style({ transform: 'translateX(-150%)' }))
            ],
            { optional: true }
          ),
        ]
      )
    ]
  )
]);
