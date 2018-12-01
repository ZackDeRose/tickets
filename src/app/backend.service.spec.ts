import { take } from 'rxjs/operators';
import { of } from 'rxjs';
import { BackendService } from './backend.service';


describe('Backend Service', () => {
  describe('ticketsBy', () => {
    fit('should filter by completed and filter term', async () => {
      const completed = true;
      const filterTerm = 'Not';
      const server = new BackendService();
      const result = await server.ticketsBy(filterTerm, completed).pipe(take(1)).toPromise();

      expect(result).toEqual([{
        id: 3,
        description: 'Not',
        assigneeId: 111,
        completed: true
      }]);
    });
  });
});
