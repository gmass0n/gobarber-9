// QUEUE CONFIGURATION

// IMPORTS
import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [ CancellationMail ];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach( ( { key, handle } ) => {
      this.queues[key] = {
        bee: new Bee( key, {
          redis: redisConfig,
        } ),
        handle,
      };
    } );
  }

  // METODO PARA ADICIONAR O JOB NA FILA
  add( queue, job ) {
    return this.queues[queue].bee.createJob( job ).save();
  }

  // METODO DE PROCESSAMENTO DE JOBS EM TEMPO REAL
  processQueue() {
    jobs.forEach( ( job ) => {
      const { bee, handle } = this.queues[job.key];

      bee.on( 'failed', this.handleFailue ).process( handle );
    } );
  }

  handleFailue( job, err ) {
    console.log( `Queue ${job.queue.name}: FAILED`, err );
  }
}

// EXPORT
export default new Queue();
