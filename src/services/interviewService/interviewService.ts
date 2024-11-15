import Interview from '../../models/interview/Interview';

// Yeni mülakat oluşturma
export const createInterview = async (data: any): Promise<any> => {
  const interview = new Interview(data);
  return await interview.save();
};

// Mülakat güncelleme
export const updateInterview = async (id: string, companyId: string, data: any): Promise<any> => {
  const interview = await Interview.findById(id);

  if (!interview) {
    throw new Error('Mülakat bulunamadı');
  }

  if (interview.createdBy.toString() !== companyId) {
    throw new Error('Bu mülakatı güncelleme yetkiniz yok');
  }

  Object.assign(interview, data);
  return await interview.save();
};

// Mülakat silme
export const deleteInterview = async (id: string, companyId: string): Promise<void> => {
  const interview = await Interview.findById(id);

  if (!interview) {
    throw new Error('Mülakat bulunamadı');
  }

  if (interview.createdBy.toString() !== companyId) {
    throw new Error('Bu mülakatı silme yetkiniz yok');
  }

  await interview.deleteOne();
};

// Kendi mülakatlarını listeleme
export const listInterviews = async (companyId: string): Promise<any[]> => {
  return await Interview.find({ createdBy: companyId });
};

// Yayınlama/yayından kaldırma
export const publishInterview = async (
  id: string,
  companyId: string,
  published: boolean
): Promise<any> => {
  const interview = await Interview.findById(id);

  if (!interview) {
    throw new Error('Mülakat bulunamadı');
  }

  if (interview.createdBy.toString() !== companyId) {
    throw new Error('Bu mülakatı yayınlama yetkiniz yok');
  }

  interview.published = published;

  if (published) {
    if (interview.linkExpiration && new Date() > interview.linkExpiration) {
      throw new Error('Başvuru linki süresi dolmuş');
    }

    const uniqueId = require('uuid').v4();
    interview.link = `${process.env.BASE_URL}/apply/${uniqueId}`;
  } else {
    interview.link = null;
  }

  return await interview.save();
};

// Yalnızca yayınlanmış mülakatları listeleme
export const listPublishedInterviews = async (): Promise<any[]> => {
  return await Interview.find({ published: true });
};

// Görüntülenme sayısını artırma
export const incrementViews = async (id: string): Promise<any> => {
  const interview = await Interview.findById(id);

  if (!interview) {
    throw new Error('Mülakat bulunamadı');
  }

  interview.views = (interview.views || 0) + 1;
  await interview.save();

  return interview; // Güncellenmiş mülakat döndürülüyor
};
// Belirli durumdaki mülakatları listeleme
export const getInterviewsByStatus = async (status: string, companyId: string): Promise<any[]> => {
  return await Interview.find({ status, createdBy: companyId });
};

// Mülakat durumunu güncelleme
export const updateInterviewStatus = async (id: string, companyId: string, status: 'active' | 'inactive' | 'completed'
): Promise<any> => {
  const interview = await Interview.findById(id);

  if (!interview) {
    throw new Error('Mülakat bulunamadı');
  }

  if (interview.createdBy.toString() !== companyId) {
    throw new Error('Bu mülakatı güncelleme yetkiniz yok');
  }

  interview.status = status;
  return await interview.save();
};


// Katılımcı sayısını kontrol et ve artır
export const incrementParticipants = async (id: string): Promise<void> => {
  const interview = await Interview.findById(id);

  if (!interview) {
    throw new Error('Mülakat bulunamadı');
  }

  if (
    interview.maxParticipants &&
    (interview.currentParticipants ?? 0) >= interview.maxParticipants
  ) {
    throw new Error('Maksimum katılımcı sayısına ulaşıldı');
  }

  interview.currentParticipants = (interview.currentParticipants ?? 0) + 1;
  await interview.save();
};
