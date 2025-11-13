const express = require('express');
const {
  issueCredential,
  getMyCredentials,
  getCredentialByHash,
  revokeCredential,
  getStudents
} = require('../controllers/credentialController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/issue', protect, authorize('university'), issueCredential);
router.get('/my', protect, getMyCredentials);
router.get('/students', protect, authorize('university'), getStudents);
router.get('/:hash', getCredentialByHash);
router.put('/:id/revoke', protect, authorize('university'), revokeCredential);

module.exports = router;
