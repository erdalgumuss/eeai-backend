import Interview from '../../models/interview/Interview';

// Yeni mülakat oluşturma
export const createInterview = async (data: any): Promise<any> => {
  const interview = new Interview(data);
  return await interview.save();
};

// Mülakat güncelleme
export const updateInterview = async (id: string, data: any): Promise<any> => {
  const interview = await Interview.findById(id);

  if (!interview) {
    throw new Error('Mülakat bulunamadı');
  }

  Object.assign(interview, data); // Gelen verilerle mevcut mülakatı güncelle
  return await interview.save();
};

// Mülakat silme
export const deleteInterview = async (id: string, adminId: string): Promise<void> => {
  const interview = await Interview.findById(id);

  if (!interview) {
    throw new Error('Mülakat bulunamadı');
  }

  if (interview.createdBy.toString() !== adminId) {
    throw new Error('Bu mülakatı silme yetkiniz yok');
  }

  await interview.deleteOne();
};

// Mülakatları listeleme (oluşturucuya göre)
export const listInterviews = async (adminId: string): Promise<any[]> => {
  return await Interview.find({ createdBy: adminId });
};

// Yayınlama/yayından kaldırma
export const publishInterview = async (id: string, published: boolean, baseUrl: string): Promise<any> => {
  const interview = await Interview.findById(id);

  if (!interview) {
    throw new Error('Mülakat bulunamadı');
  }

  interview.published = published;

  if (published) {
    if (interview.linkExpiration && new Date() > interview.linkExpiration) {
      throw new Error('Başvuru linki süresi dolmuş');
    }

    const uniqueId = require('uuid').v4(); // Benzersiz bir kimlik oluştur
    interview.link = `${baseUrl}/apply/${uniqueId}`;
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
export const incrementViews = async (id: string): Promise<void> => {
  const interview = await Interview.findById(id);

  if (!interview) {
    throw new Error('Mülakat bulunamadı');
  }

  interview.views = (interview.views || 0) + 1;
  await interview.save();
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
  
