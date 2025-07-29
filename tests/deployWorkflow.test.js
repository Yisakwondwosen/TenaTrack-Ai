const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const { expect } = require('chai');

describe('GitHub Workflow: auth-deploy', () => {
  let workflow;

  before(() => {
    const filePath = path.resolve(__dirname, '../deploy.yml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    workflow = yaml.load(fileContents);
  });

  it('should trigger on push to main branch', () => {
    expect(workflow.on).to.have.property('push');
    expect(workflow.on.push.branches).to.include('main');
  });

  it('should have firestore-rules-validation job', () => {
    expect(workflow.jobs).to.have.property('firestore-rules-validation');
    const job = workflow.jobs['firestore-rules-validation'];
    expect(job.name).to.equal('Firestore Rules Validation');
    expect(job.steps.some(step => step.name === 'Validate Firestore Rules')).to.be.true;
  });

  it('should have functions-linting job', () => {
    expect(workflow.jobs).to.have.property('functions-linting');
    const job = workflow.jobs['functions-linting'];
    expect(job.name).to.equal('Functions Linting');
    expect(job.steps.some(step => step.name === 'Run ESLint')).to.be.true;
  });

  it('should have hosting-deployment job depending on previous jobs', () => {
    expect(workflow.jobs).to.have.property('hosting-deployment');
    const job = workflow.jobs['hosting-deployment'];
    expect(job.name).to.equal('Hosting Deployment');
    expect(job.needs).to.include.members(['firestore-rules-validation', 'functions-linting']);
    expect(job.steps.some(step => step.name === 'Deploy Hosting')).to.be.true;
  });
});
